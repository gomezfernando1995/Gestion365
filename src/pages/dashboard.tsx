import Header from '../components/Header';
import StatusCards from '../components/StatusCards';
import { TopUsers } from '../components/TopUsers';
import IncidentsTable from '../components/IncidentsTable';


const Dashboard = () => {
  return (
    <div className="flex-1 overflow-y-auto flex flex-col">
      <Header />
      <main className="p-6 space-y-6 overflow-y-auto">
        <StatusCards />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopUsers />
          <IncidentsTable />
        </div>
      </main>
    </div>
  );
};

export default Dashboard