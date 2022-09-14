const URI = "http://localhost:8080";

export const getRooms = () => {
  return `${URI}/rooms`
}

export function api<T>(url: string): Promise<T> {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      return response.json() as Promise<T>
    })

}