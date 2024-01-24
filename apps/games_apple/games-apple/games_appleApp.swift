//
//  games_appleApp.swift
//  games-apple
//
//  Created by Ghoshan Jaganathamani on 11/11/2023.
//

import SwiftUI
import SwiftData

@main
struct games_appleApp: App {

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        print("yoyo")
        SocketStuff.shared.connect()
        return true
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Connect the socket when the app becomes active
        SocketStuff.shared.connect()
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Disconnect the socket when the app goes to the background
        SocketStuff.shared.disconnect()
    }
    
    var sharedModelContainer: ModelContainer = {
        let schema = Schema([
            Item.self,
        ])
        let modelConfiguration = ModelConfiguration(schema: schema, isStoredInMemoryOnly: false)

        do {
            return try ModelContainer(for: schema, configurations: [modelConfiguration])
        } catch {
            fatalError("Could not create ModelContainer: \(error)")
        }
    }()

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .modelContainer(sharedModelContainer)
    }
}
