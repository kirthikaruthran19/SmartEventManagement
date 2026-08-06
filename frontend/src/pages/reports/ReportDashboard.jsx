import { toast } from "react-toastify";

import { exportBookingReport } from "../../services/reportService";

function ReportDashboard() {

    const handleExport = async () => {

        try {

            const response = await exportBookingReport();

            const blob = new Blob(
                [response.data],
                {
                    type: "text/csv",
                }
            );

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;
            link.download = "booking_report.csv";

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);

            window.URL.revokeObjectURL(url);

            toast.success("Booking report downloaded successfully.");

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to download report."
            );

        }

    };

    return (
        <div className="container-fluid">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <h2 className="fw-bold">
                        Reports
                    </h2>

                    <p className="text-muted mb-0">
                        Export booking reports.
                    </p>
                </div>

            </div>

            <div className="card shadow-sm border-0">

                <div className="card-body text-center py-5">

                    <i className="bi bi-file-earmark-spreadsheet fs-1 text-success"></i>

                    <h4 className="mt-3">
                        Booking Report
                    </h4>

                    <p className="text-muted">
                        Download all bookings as a CSV file.
                    </p>

                    <button
                        className="btn btn-success"
                        onClick={handleExport}
                    >
                        <i className="bi bi-download me-2"></i>
                        Download CSV
                    </button>

                </div>

            </div>

        </div>
    );
}

export default ReportDashboard;