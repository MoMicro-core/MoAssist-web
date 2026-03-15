export const getRuntime = () => {
  const runtime = window.MOMICRO_ASSIST_RUNTIME || {}
  const apiBaseUrl =
    runtime.apiBaseUrl || import.meta.env.VITE_API_URL || window.location.origin
  return { ...runtime, apiBaseUrl }
}
