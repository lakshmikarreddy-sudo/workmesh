import { useEffect, useState } from "react";
import { Task } from "./types/workmesh";
import Home from "./screens/Home";
import ProcessMap from "./screens/ProcessMap";
import TaskIntelligence from "./screens/TaskIntelligence";
import WorkforceAllocation from "./screens/WorkforceAllocation";
import WorkforceBlueprint from "./screens/WorkforceBlueprint";
import Simulation from "./screens/Simulation";

type Screen =
  | "home"
  | "processMap"
  | "taskIntelligence"
  | "workforceAllocation"
  | "workforceBlueprint"
  | "simulation";

function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  if (screen === "simulation" && selectedTask) {
    return <Simulation onBack={() => setScreen("workforceBlueprint")} />;
  }

  if (screen === "workforceBlueprint" && selectedTask) {
    return (
      <WorkforceBlueprint
        onBack={() => setScreen("workforceAllocation")}
        onRunSimulation={() => setScreen("simulation")}
      />
    );
  }

  if (screen === "workforceAllocation" && selectedTask) {
    return (
      <WorkforceAllocation
        onBack={() => setScreen("taskIntelligence")}
        onBuildBlueprint={() => setScreen("workforceBlueprint")}
      />
    );
  }

  if (screen === "taskIntelligence" && selectedTask) {
    return (
      <TaskIntelligence
        task={selectedTask}
        onBack={() => setScreen("processMap")}
        onViewAllocation={() => setScreen("workforceAllocation")}
      />
    );
  }

  if (screen === "processMap") {
    return (
      <ProcessMap
        onBack={() => setScreen("home")}
        onSelectTask={(task) => {
          setSelectedTask(task);
          setScreen("taskIntelligence");
        }}
      />
    );
  }

  return <Home onAnalyze={() => setScreen("processMap")} />;
}

export default App;
