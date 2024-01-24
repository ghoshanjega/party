//
//  ViewModel.swift
//  games-apple
//
//  Created by Ghoshan Jaganathamani on 12/11/2023.
//

import Foundation


struct GamePlayerDto: Hashable, Codable {
  var id: String
  var username: String
  var ready: Bool
  var isLeader: Bool
}

struct GameEngineDto: Hashable, Codable {
  var location: String
  var players: [String: GamePlayerDto]
  var label: String
  var identifier: String
}

struct GameRoomDto: Hashable, Codable {
  var name: String
  var engine: GameEngineDto
}

struct GameRoomsDto: Hashable, Codable {
  var rooms: [String: GameRoomDto]
}

class ViewModel: ObservableObject {
  @Published var gameRooms: GameRoomsDto = GameRoomsDto(rooms: [:])
  func fetch() {
    guard let url = URL(string: "https://party-api.fly.dev/rooms") else {
      return
    }

    let task = URLSession.shared.dataTask(with: url) { [weak self] data, _, error in
      guard let data = data, error == nil else {
        return
      }
      print("refetching")
      // Convert to JSON
      do {
        let res = JSONDecoder()
        res.keyDecodingStrategy = .convertFromSnakeCase
        let rooms = try res.decode(GameRoomsDto.self, from: data)
        DispatchQueue.main.async {
          self?.gameRooms = rooms
        }
      } catch {
        print("decode error", error)
      }
    }
    task.resume()
  }

  // Use shared socket to emit event "create_and_join_room"
  func createRoom(name: String) {
    // emit socket event name "create_and_join_room" with data { "gameId": "agar" }

    SocketStuff.shared.emitEvent(
      eventName: "create_and_join_room",
      withData: ["""
        {
         "room": "lobby",
         "gameId": "agar"
        }
        """])
  }

  // Use shared socket to emit event "join_room"
  func joinRoom(roomId: String) {
    SocketStuff.shared.emitEvent(eventName: "join_room", withData: [roomId])
  }

  // Use shared socket to emit event "leave_room"
  func leaveRoom(roomId: String) {
    SocketStuff.shared.emitEvent(eventName: "leave_room", withData: [roomId])
  }

  // Use shared socket to emit event "ready"
  func ready(roomId: String) {
    SocketStuff.shared.emitEvent(eventName: "ready", withData: [roomId])
  }

  // Use shared socket to emit event "unready"
  func unready(roomId: String) {
    SocketStuff.shared.emitEvent(eventName: "unready", withData: [roomId])
  }

}
