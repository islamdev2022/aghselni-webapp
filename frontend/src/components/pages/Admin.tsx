import { Link } from "react-router-dom";
const Admin = () => { 
    return (
        <div>
        <h1>Admin</h1>
        <Link to="/signup/extern_employee" >Register New ExternEmployee</Link>
        <br />
        <Link to="/signup/intern_employee" >Register New InternEmployee</Link>
        <br />
        </div>
    );
    }
export default Admin;