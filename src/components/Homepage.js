import React from 'react'

export default function Homepage() {
  return (
    <div className='homepage-container'>
      <header className="homepage-header">
        <h1>Welcome to the Chess World</h1>
        <p>Discover the fascinating world of chess - a game of strategy, intellect, and history.</p>
      </header>

      <div className="content-container">
        <section className="section">
          <h2>Why Play Chess?</h2>
          <p>Chess is not just a game; it's an art, a science, and a sport. Here are some compelling reasons why people around the world are passionate about chess:</p>
          <ul>
            <li><strong>Mental Challenge:</strong> Chess challenges your mind, improving concentration, memory, and strategic thinking.</li>
            <li><strong>Social Interaction:</strong> Engage with opponents and friends, fostering social connections and sportsmanship.</li>
            <li><strong>Historical Significance:</strong> Explore a game with a rich history dating back over a thousand years, played by kings, scholars, and enthusiasts.</li>
            <li><strong>Global Community:</strong> Join a worldwide community of millions of players, from beginners to grandmasters, sharing a passion for the game.</li>
          </ul>
        </section>

        <section className="section">
          <h2>Interesting Facts About Chess</h2>
          <ul>
            <li>Chess originated in India during the Gupta Empire around the 6th century AD.</li>
            <li>The longest game of chess possible is 5,949 moves.</li>
            <li>There are more possible iterations of a game of chess than there are atoms in the observable universe.</li>
            <li>Chess is recognized as a sport by the International Olympic Committee.</li>
            <li>The youngest chess grandmaster is Sergey Karjakin, who achieved the title at the age of 12.</li>
          </ul>
        </section>

        <section className="section">
          <h2>A Brief History of Chess</h2>
          <p>Chess has evolved over centuries, transcending borders and cultures. Originating in ancient India, the game spread across Persia, Arabia, and eventually Europe. It gained popularity among nobility and scholars, evolving its rules and strategies over time. Today, chess stands as a timeless game, played and cherished by people worldwide.</p>
          <p>Explore the depths of chess, challenge your mind, and embark on a journey through history, strategy, and passion. Whether you're a beginner or a seasoned player, the world of chess awaits.</p>
        </section>
      </div>
    </div>
  )
}
