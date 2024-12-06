import Header from "../../components/common/Header";
import BlogsTable from "../../components/Blogs/BlogsTable";
import UsersTable from "../../components/Users/UsersTable";

const UsersPage = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Tài khoản" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}

        <UsersTable />

        {/* CHARTS */}
        <div className="grid grid-col-1 lg:grid-cols-2 gap-8">
          {/* Có thể thêm biểu đồ tại đây */}
        </div>
      </main>
    </div>
  );
};

export default UsersPage;
