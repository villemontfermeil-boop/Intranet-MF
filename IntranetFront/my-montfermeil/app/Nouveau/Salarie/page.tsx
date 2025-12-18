
'use client'





function AdminPanel(){

    const visiteur = sessionStorage.getItem('isAdmin');

    if (visiteur !== 'true') {
        return (
            <div style={{color: "red"}}><h1>Access Denied. Admins only.</h1></div>
        )
    }
    return <div>Admin Panel</div>;
}

export default AdminPanel;  