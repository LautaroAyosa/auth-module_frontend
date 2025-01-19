import ProtectedRoute from "@/components/ProtectedRoute";

const Dashboard = () => {

  

  return (
    <ProtectedRoute requiredRoles={["admin"]}>
      <div>
        <h1>Dashboard</h1>
        <button >Fetch Data</button>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
