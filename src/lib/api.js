import { getRuntime } from "./runtime";
import { getSessionToken } from "./session";

const getBaseUrl = () => {
  const base = getRuntime().apiBaseUrl || "";
  return base.replace(/\/$/, "");
};

const unwrapResource = (data, keys, depth = 3) => {
  let current = data;
  for (let index = 0; index < depth; index += 1) {
    if (!current || typeof current !== "object" || Array.isArray(current))
      return current;
    const key = keys.find(
      (candidate) =>
        current[candidate] !== undefined && current[candidate] !== null,
    );
    if (!key) return current;
    current = current[key];
  }
  return current;
};

const unwrapCollection = (data, keys, depth = 3) => {
  let current = data;
  for (let index = 0; index < depth; index += 1) {
    if (Array.isArray(current)) return current;
    if (!current || typeof current !== "object") return [];
    const key = keys.find(
      (candidate) =>
        current[candidate] !== undefined && current[candidate] !== null,
    );
    if (!key) return [];
    current = current[key];
  }
  return Array.isArray(current) ? current : [];
};

const isChatbotPayloadMismatch = (error) =>
  [400, 404, 415, 422].includes(error?.status);

const withQuery = (path, params) => {
  if (!params) return path;
  const search = new URLSearchParams(
    Object.entries(params).reduce((acc, [key, value]) => {
      if (value === undefined || value === null || value === "") return acc;
      acc[key] = value;
      return acc;
    }, {}),
  ).toString();
  if (!search) return path;
  return `${path}?${search}`;
};

export const apiRequest = async (
  path,
  { method = "GET", body, headers, isForm } = {},
) => {
  const url = `${getBaseUrl()}${path}`;
  const token = getSessionToken();
  const finalHeaders = { ...(headers || {}) };
  if (token) finalHeaders.Authorization = `Bearer ${token}`;
  if (!isForm && body !== undefined) {
    finalHeaders["Content-Type"] = "application/json";
  }
  const response = await fetch(url, {
    method,
    headers: finalHeaders,
    body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
  });
  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }
  if (!response.ok) {
    const message =
      data?.message ||
      data?.error?.message ||
      data?.error ||
      data?.details?.message ||
      "Request failed";
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }
  return data;
};

const requestChatbotMutation = async (path, method, settings = {}) => {
  try {
    const data = await apiRequest(path, { method, body: { settings } });
    return unwrapResource(data, ["chatbot", "item", "result", "data"]);
  } catch (error) {
    if (!isChatbotPayloadMismatch(error)) throw error;
    const data = await apiRequest(path, { method, body: settings });
    return unwrapResource(data, ["chatbot", "item", "result", "data"]);
  }
};

export const api = {
  auth: {
    createSession: (payload) =>
      apiRequest("/v1/auth/session", { method: "POST", body: payload }),
    me: () => apiRequest("/v1/auth/me"),
    logout: () => apiRequest("/v1/auth/logout", { method: "POST" }),
    updateProfile: (payload) =>
      apiRequest("/v1/users/me", { method: "PATCH", body: payload }),
  },
  chatbots: {
    list: async () =>
      unwrapCollection(await apiRequest("/v1/chatbots"), [
        "chatbots",
        "items",
        "results",
        "data",
      ]),
    create: (settings) =>
      requestChatbotMutation("/v1/chatbots", "POST", settings),
    languages: () => apiRequest("/v1/chatbots/languages"),
    get: async (chatbotId) =>
      unwrapResource(await apiRequest(`/v1/chatbots/${chatbotId}`), [
        "chatbot",
        "item",
        "result",
        "data",
      ]),
    update: (chatbotId, settings) =>
      requestChatbotMutation(`/v1/chatbots/${chatbotId}`, "PATCH", settings),
    remove: (chatbotId) =>
      apiRequest(`/v1/chatbots/${chatbotId}`, { method: "DELETE" }),
    install: (chatbotId) => apiRequest(`/v1/chatbots/${chatbotId}/install`),
    analytics: (chatbotId) => apiRequest(`/v1/chatbots/${chatbotId}/analytics`),
    files: async (chatbotId) =>
      unwrapCollection(await apiRequest(`/v1/chatbots/${chatbotId}/files`), [
        "files",
        "items",
        "results",
        "data",
      ]),
    uploadFiles: (chatbotId, files) => {
      const form = new FormData();
      files.forEach((file) => form.append("file", file));
      return apiRequest(`/v1/chatbots/${chatbotId}/files`, {
        method: "POST",
        body: form,
        isForm: true,
      });
    },
    uploadLogo: async (chatbotId, file) => {
      const form = new FormData();
      form.append("file", file);
      return unwrapResource(
        await apiRequest(`/v1/chatbots/${chatbotId}/logo`, {
          method: "POST",
          body: form,
          isForm: true,
        }),
        ["chatbot", "item", "result", "data"],
      );
    },
    deleteFile: (chatbotId, fileId) =>
      apiRequest(`/v1/chatbots/${chatbotId}/files/${fileId}`, {
        method: "DELETE",
      }),
    conversations: async (chatbotId) =>
      unwrapCollection(
        await apiRequest(`/v1/chatbots/${chatbotId}/conversations`),
        ["conversations", "items", "results", "data"],
      ),
  },
  conversations: {
    list: async (params) =>
      unwrapCollection(
        await apiRequest(withQuery("/v1/conversations", params)),
        ["conversations", "items", "results", "data"],
      ),
    get: (conversationId) => apiRequest(`/v1/conversations/${conversationId}`),
    sendMessage: (conversationId, content) =>
      apiRequest(`/v1/conversations/${conversationId}/messages`, {
        method: "POST",
        body: { content },
      }),
    close: (conversationId) =>
      apiRequest(`/v1/conversations/${conversationId}/close`, {
        method: "POST",
      }),
    markRead: (conversationId) =>
      apiRequest(`/v1/conversations/${conversationId}/read`, {
        method: "POST",
      }),
  },
  billing: {
    summary: (chatbotId) =>
      apiRequest(withQuery("/v1/subscription", { chatbotId })),
    checkout: (payload) =>
      apiRequest("/v1/subscription/checkout", {
        method: "POST",
        body: payload,
      }),
    portal: (payload) =>
      apiRequest("/v1/subscription/portal", {
        method: "POST",
        body: payload,
      }),
    trial: (payload) =>
      apiRequest("/v1/subscription/trial", {
        method: "POST",
        body: payload,
      }),
  },
  public: {
    widgetConfig: (chatbotId) =>
      apiRequest(`/v1/public/chatbots/${chatbotId}/widget`),
  },
  withQuery,
};
