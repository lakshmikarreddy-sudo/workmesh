interface HomeProps {
  onAnalyze: () => void;
}

function Home({ onAnalyze }: HomeProps) {
  return (
    <main className="home">
      <div className="home-content">
        <p className="eyebrow">WORKMESH</p>

        <h1>
          Map the work.
          <br />
          Design the workforce.
        </h1>

        <p className="subtitle">
          Analyze business processes task-by-task and determine how work
          should be distributed across humans, AI and automation.
        </p>

        <button onClick={onAnalyze}>ANALYZE PROCESS →</button>
      </div>
    </main>
  );
}

export default Home;