export const URI = process.env.NEXT_PUBLIC_API_URL!

export const getRooms = () => {
  return `${URI}/rooms`
}

export function api<T>(url: string): Promise<T> {
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    return response.json() as Promise<T>
  })
}
