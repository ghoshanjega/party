//
//  ContentView.swift
//  games-apple
//
//  Created by Ghoshan Jaganathamani on 11/11/2023.
//

import SwiftData
import SwiftUI



struct ContentView: View {
  @Environment(\.modelContext) private var modelContext
  @Query private var items: [Item]
  @State private var index = 0
  @ObservedObject var viewModel = ViewModel()

  var body: some View {
    HStack {
      Text("Party").font(.largeTitle).fontWeight(.heavy).frame(
        maxWidth: .infinity, alignment: .leading
      ).padding()
        .frame(alignment: .top)
    }
    VStack(alignment: .leading, spacing: 0) {
      TabView(selection: $index) {
        ForEach((0..<games.count), id: \.self) { index in
          CardView(index: index)
        }
      }.frame(height: 200)
        .tabViewStyle(PageTabViewStyle(indexDisplayMode: .never))
      Text("Rooms").font(.title2).bold().padding()
      List {
        ForEach(Array(viewModel.gameRooms.rooms.values), id: \.hashValue) { room in
          HStack {
            Text(room.name)
            Spacer()
            Text("\(room.engine.players.count) 🎮")
          }.padding(5)

        }
      }.onAppear {
        Timer.scheduledTimer(withTimeInterval: 10, repeats: true) { _ in
          viewModel.fetch()
        }

      }
      Spacer()
    }

  }

  private func addItem() {
    withAnimation {
      let newItem = Item(timestamp: Date())
      modelContext.insert(newItem)
    }
  }

  private func deleteItems(offsets: IndexSet) {
    withAnimation {
      for index in offsets {
        modelContext.delete(items[index])
      }
    }
  }
}
struct Game {
  var id: String
  var label: String
  var image: String
  //  instructions: ReactNode
}

let agar = Game(id: "agar", label: "Space balls", image: "SpaceJunkies")
let agar2 = Game(id: "next", label: "TBD", image: "SpaceJunkies")

var games = [agar, agar2]

struct CardView: View {
  var index: Int
  @State private var showingPopover = false
  var body: some View {
    ZStack {
      RoundedRectangle(cornerRadius: 20)
        .fill(Color.black)
      VStack {
        Spacer()
        HStack {
          ZStack {

            Text(games[index].label)
              .font(.title)
              .fontWeight(.bold)
              .foregroundColor(.white)
              .padding()

          }
          Spacer()
          // Button(action: addItem) {
          //     Label("Add Item", systemImage: "plus")
          // }

          Button(action: { showingPopover = true }) {
            Label("New", systemImage: "plus").padding()

          }
          .popover(isPresented: $showingPopover) {
            PopoverView(popoverType: .newGame)
          }

        }
      }
    }.padding()
  }

}
enum PopoverType {
  case newGame
  case joinFame
}

// Create popover view
struct PopoverView: View {

  // State variable
  var popoverType: PopoverType
  @State var showingPopover = false
  var body: some View {
      VStack() {
          InstructionsView()
          Spacer()
          if popoverType == .newGame {
            VStack {
              Text("Create new room?")
              Button("New Game") {
                showingPopover = false
              }
            }
          } else {
            VStack {
              Text("Join Room")
              Button("Ready") {

              }
            }
          }
      }.padding()
    

  }
}

// Create instructions view
struct InstructionsView: View {
  var body: some View {
    VStack {
      Text("Instructions").font(.headline)
    }
  }
}

#Preview {
  ContentView()
    .modelContainer(for: Item.self, inMemory: true)
}
