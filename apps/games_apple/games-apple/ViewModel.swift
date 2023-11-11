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
}
