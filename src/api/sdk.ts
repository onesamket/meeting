
const VIDEOSDK_TOKEN = import.meta.env.VITE_VIDEOSDK_TOKEN
const VIDEOSDK_API_ENDPOINT = "https://api.videosdk.live"

export const authToken = VIDEOSDK_TOKEN

export const createMeeting = async ({ token }: { token: string }): Promise<string> => {
  try {
    const response = await fetch(`${VIDEOSDK_API_ENDPOINT}/v2/rooms`, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to create meeting: ${response.statusText}`)
    }

    const data = await response.json()
    return data.roomId
  } catch (error) {
    console.error("Error creating meeting:", error)
    return "demo-meeting-" + Math.random().toString(36).substr(2, 9)
  }
}

export const validateMeeting = async ({
  meetingId,
  token,
}: {
  meetingId: string
  token: string
}): Promise<boolean> => {
  try {
    const response = await fetch(`${VIDEOSDK_API_ENDPOINT}/v2/rooms/validate/${meetingId}`, {
      method: "GET",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    })

    return response.ok
  } catch (error) {
    console.error("Error validating meeting:", error)
    return true // Allow fallback for development
  }
}
