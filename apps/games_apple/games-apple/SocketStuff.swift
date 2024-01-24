//
//  SocketStuff.swift
//  games-apple
//
//  Created by Ghoshan Jaganathamani on 16/12/2023.
//
import Foundation
import SocketIO

class SocketStuff {
  static let shared = SocketStuff()
  private let manager: SocketManager
  private let socket: SocketIOClient

  private init() {
    manager = SocketManager(
        socketURL: URL(string: "ws://localhost:8080")!, config: [.log(true), .compress, .forceWebsockets(true)])
    socket = manager.defaultSocket
  }

  func connect() {
    socket.connect()
  }

  func disconnect() {
    socket.disconnect()
  }

  func listenToEvent(eventName: String, completion: @escaping ([Any], SocketAckEmitter) -> Void) {
    socket.on(eventName) { data, ack in
      completion(data, ack)
    }
  }

  func emitEvent(eventName: String, withData data: [Any]) {
    print(socket.status)
    socket.emit(eventName, data)
  }
}
