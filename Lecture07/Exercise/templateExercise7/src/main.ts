// Interfaces
interface Card {
  id: number // Unique identifier for the card
  symbol: string // Symbol displayed on the card
  isFlipped: boolean // Whether the card is currently flipped
  isMatched: boolean // Whether the card has been matched
}

interface Player {
  id: number // Unique identifier for the player
  name: string // Player's name
  score: number // Player's score
}

interface GameConfig {
  numPairs: number // Number of pairs of cards in the game
  theme: GameTheme // Theme of the game (e.g., fruits, animals)
  players: number // Number of players
}

// Enums
enum GameTheme {
  FRUITS = "fruits", // Fruits theme
  ANIMALS = "animals", // Animals theme
  NUMBERS = "numbers", // Numbers theme
}

enum GameState {
  WAITING = "waiting", // Waiting for player action
  COMPARING = "comparing", // Comparing two flipped cards
  GAME_OVER = "gameOver", // Game has ended
}

// Game class to manage the state and logic
class MemoryGame {
  private cards: Card[] = [] // Array of all cards in the game
  private players: Player[] = [] // Array of players
  private flippedCards: Card[] = [] // Currently flipped cards
  private currentPlayerIndex: number = 0 // Index of the current player
  private gameState: GameState = GameState.WAITING // Current state of the game
  private matchedPairs: number = 0 // Number of matched pairs
  private hintsRemaining: number = 3 // Number of hints remaining
  private config: GameConfig // Game configuration
  private themes: Map<GameTheme, string[]> // Map of themes to their symbols

  constructor() {
    // Default configuration
    this.config = {
      numPairs: 4, // Default number of pairs
      theme: GameTheme.FRUITS, // Default theme
      players: 1, // Default number of players
    }

    // Define themes
    this.themes = new Map<GameTheme, string[]>([
      [
        GameTheme.FRUITS,
        ["🍎", "🍌", "🍉", "🍇", "🍊", "🍍", "🥝", "🍒", "🍓", "🥥"],
      ],
      [
        GameTheme.ANIMALS,
        ["🐶", "🐱", "🐭", "🐰", "🦊", "🐻", "🐼", "🐨", "🦁", "🐯"],
      ],
      [
        GameTheme.NUMBERS,
        ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"],
      ],
    ])

    this.initEventListeners() // Initialize event listeners for UI interactions
  }

  private initEventListeners(): void {
    // Set up event listeners for configuration controls
    document
      .getElementById("startGame")
      ?.addEventListener("click", () => this.startGame())
    document
      .getElementById("pairSlider")
      ?.addEventListener("input", (e) => this.updatePairCount(e))
    document
      .getElementById("playerSlider")
      ?.addEventListener("input", (e) => this.updatePlayerCount(e))

    // Theme selection
    document.querySelectorAll(".theme-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const theme = (e.target as HTMLElement).dataset.theme as GameTheme
        this.updateTheme(theme)
      })
    })

    // Hint button
    document
      .getElementById("hintBtn")
      ?.addEventListener("click", () => this.useHint())
  }

  private updatePairCount(e: Event): void {
    // Update the number of pairs based on slider input
    const target = e.target as HTMLInputElement
    this.config.numPairs = parseInt(target.value)
    document.getElementById("pairValue")!.textContent = target.value
  }

  private updatePlayerCount(e: Event): void {
    // Update the number of players based on slider input
    const target = e.target as HTMLInputElement
    this.config.players = parseInt(target.value)
    document.getElementById("playerValue")!.textContent = target.value
  }

  private updateTheme(theme: GameTheme): void {
    // Update the game theme and UI
    this.config.theme = theme

    // Update active theme button UI
    document.querySelectorAll(".theme-btn").forEach((btn) => {
      btn.classList.remove("active")
      if ((btn as HTMLElement).dataset.theme === theme) {
        btn.classList.add("active")
      }
    })
  }

  public startGame(): void {
    // Start a new game
    this.resetGame()
    this.createPlayers()
    this.createCards()
    this.renderBoard()
    this.updatePlayerUI()
  }

  private resetGame(): void {
    // Reset game state and UI elements
    this.cards = []
    this.flippedCards = []
    this.matchedPairs = 0
    this.gameState = GameState.WAITING
    this.currentPlayerIndex = 0
    this.hintsRemaining = 3

    // Reset UI elements
    document.getElementById("gameBoard")!.innerHTML = ""
    document.getElementById("message")!.textContent = ""
    document.getElementById(
      "hintRemaining"
    )!.textContent = `${this.hintsRemaining}`
  }

  private createPlayers(): void {
    // Create player objects based on the number of players
    this.players = []
    for (let i = 0; i < this.config.players; i++) {
      this.players.push({
        id: i,
        name: `Player ${i + 1}`,
        score: 0,
      })
    }
  }

  private createCards(): void {
    // Create card objects based on the selected theme and number of pairs
    const symbols = this.themes
      .get(this.config.theme)!
      .slice(0, this.config.numPairs)
    const cardPairs: string[] = []

    // Create pairs of cards
    symbols.forEach((symbol) => {
      cardPairs.push(symbol, symbol)
    })

    // Shuffle the cards
    this.shuffleArray(cardPairs)

    // Create card objects
    this.cards = cardPairs.map((symbol, index) => ({
      id: index,
      symbol,
      isFlipped: false,
      isMatched: false,
    }))
  }

  private shuffleArray<T>(array: T[]): void {
    // Shuffle an array using the Fisher-Yates algorithm
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
  }

  private renderBoard(): void {
    // Render the game board with cards
    const gameBoard = document.getElementById("gameBoard")!
    gameBoard.innerHTML = ""

    this.cards.forEach((card) => {
      const cardElement = document.createElement("div")
      cardElement.className = "card"
      cardElement.dataset.id = card.id.toString()
      cardElement.innerHTML = `
                    <div class="card-inner">
                        <div class="card-front">?</div>
                        <div class="card-back">${card.symbol}</div>
                    </div>
                `
      cardElement.addEventListener("click", () => this.handleCardClick(card))
      gameBoard.appendChild(cardElement)
    })
  }

  private handleCardClick(card: Card): void {
    // Handle card click events
    if (
      this.gameState === GameState.COMPARING || // Ignore clicks during comparison
      card.isMatched || // Ignore clicks on matched cards
      card.isFlipped || // Ignore clicks on already flipped cards
      this.flippedCards.length >= 2 // Ignore clicks if two cards are already flipped
    ) {
      return
    }

    // Flip the card
    card.isFlipped = true
    this.flippedCards.push(card)
    this.updateCardUI(card)

    // Check if we have 2 flipped cards
    if (this.flippedCards.length === 2) {
      this.gameState = GameState.COMPARING
      setTimeout(() => this.checkMatch(), 1000) // Delay to show the flipped cards
    }
  }

  private checkMatch(): void {
    // Check if the two flipped cards match
    const [card1, card2] = this.flippedCards
    const currentPlayer = this.players[this.currentPlayerIndex]

    if (card1.symbol === card2.symbol) {
      // Match found
      card1.isMatched = true
      card2.isMatched = true
      this.matchedPairs++
      currentPlayer.score++

      // Update UI
      this.updateCardUI(card1)
      this.updateCardUI(card2)
      this.updateScoreboard()

      // Check if game is over
      if (this.matchedPairs === this.config.numPairs) {
        this.endGame()
      }
    } else {
      // No match, flip cards back
      card1.isFlipped = false
      card2.isFlipped = false

      // Update UI
      this.updateCardUI(card1)
      this.updateCardUI(card2)

      // Switch to next player
      this.nextPlayer()
    }

    this.flippedCards = []
    this.gameState = GameState.WAITING
  }

  private updateCardUI(card: Card): void {
    // Update the UI for a specific card
    const cardElement = document.querySelector(
      `.card[data-id="${card.id}"]`
    ) as HTMLElement

    if (card.isFlipped) {
      cardElement.classList.add("flipped")
    } else {
      cardElement.classList.remove("flipped")
    }

    if (card.isMatched) {
      cardElement.classList.add("matched")
    }
  }

  private nextPlayer(): void {
    // Switch to the next player
    if (this.config.players > 1) {
      this.currentPlayerIndex =
        (this.currentPlayerIndex + 1) % this.players.length
      this.updatePlayerUI()
    }
  }

  private updatePlayerUI(): void {
    // Update the UI to show the current player's turn
    const playerIndicator = document.getElementById("currentPlayer")!
    playerIndicator.textContent = `Player ${this.currentPlayerIndex + 1}'s Turn`

    // Highlight current player in the scoreboard
    document.querySelectorAll(".player-score").forEach((element, index) => {
      if (index === this.currentPlayerIndex) {
        element.classList.add("active-player")
      } else {
        element.classList.remove("active-player")
      }
    })
  }

  private updateScoreboard(): void {
    // Update the scoreboard UI
    const scoreboard = document.getElementById("scoreboard")!
    scoreboard.innerHTML = ""

    this.players.forEach((player, index) => {
      const playerElement = document.createElement("div")
      playerElement.className = "player-score"
      if (index === this.currentPlayerIndex) {
        playerElement.classList.add("active-player")
      }
      playerElement.textContent = `${player.name}: ${player.score}`
      scoreboard.appendChild(playerElement)
    })
  }

  private endGame(): void {
    // End the game and display the winner(s)
    this.gameState = GameState.GAME_OVER

    // Find winner(s)
    let maxScore = Math.max(...this.players.map((p) => p.score))
    const winners = this.players.filter((p) => p.score === maxScore)

    // Create winner message
    let message = ""
    if (winners.length === 1) {
      message = `${winners[0].name} wins with ${winners[0].score} points!`
    } else {
      const winnerNames = winners.map((w) => w.name).join(" and ")
      message = `It's a tie! ${winnerNames} tied with ${maxScore} points each!`
    }

    // Show game over message
    document.getElementById(
      "message"
    )!.innerHTML = `<h3>🎉 Game Over! 🎉</h3><p>${message}</p>`
  }

  public useHint(): void {
    // Use a hint to briefly show two matched cards
    if (this.hintsRemaining <= 0 || this.gameState !== GameState.WAITING) {
      return
    }

    this.hintsRemaining--
    document.getElementById(
      "hintRemaining"
    )!.textContent = `${this.hintsRemaining}`

    // Find unmatched cards
    const unmatchedCards = this.cards.filter(
      (card) => !card.isMatched && !card.isFlipped
    )

    // Group cards by their value/image to find pairs
    const cardGroups = new Map<string, any[]>()

    unmatchedCards.forEach((card) => {
      const value = card.symbol
      if (!cardGroups.has(value)) {
        cardGroups.set(value, [])
      }
      cardGroups.get(value)!.push(card)
    })

    // Find the first group that has at least 2 cards (a matching pair)
    let hintCards: any[] = []

    for (const [_, cards] of cardGroups) {
      if (cards.length >= 2) {
        hintCards = cards.slice(0, 2)
        break
      }
    }

    // If we found a pair, show them as hints
    if (hintCards.length === 2) {
      // Show cards briefly
      hintCards.forEach((card) => {
        const cardElement = document.querySelector(
          `.card[data-id="${card.id}"]`
        ) as HTMLElement
        cardElement.classList.add("hint")
      })

      // Hide after delay
      setTimeout(() => {
        hintCards.forEach((card) => {
          const cardElement = document.querySelector(
            `.card[data-id="${card.id}"]`
          ) as HTMLElement
          cardElement.classList.remove("hint")
        })
      }, 1000)
    }
  }
}

// Initialize the game when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new MemoryGame()
})
