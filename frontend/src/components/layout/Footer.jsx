function Footer() {
    return (
        <footer className="bg-dark text-white py-3 mt-auto">
            <div className="container">

                <div className="row align-items-center">

                    <div className="col-md-6 text-center text-md-start">
                        © {new Date().getFullYear()} Smart Event Management System
                    </div>

                    <div className="col-md-6 text-center text-md-end">

                        <i className="bi bi-facebook me-3"></i>

                        <i className="bi bi-instagram me-3"></i>

                        <i className="bi bi-twitter-x me-3"></i>

                        <i className="bi bi-linkedin"></i>

                    </div>

                </div>

            </div>
        </footer>
    );
}

export default Footer;