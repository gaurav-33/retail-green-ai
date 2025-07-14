import React from 'react';

export const SystemHealth = () => {
  const services = [
    { name: "Node.js Backend", uptime: "99.8%", status: "healthy" },
    { name: "ML Service", uptime: "99.2%", status: "healthy" },
    { name: "Database", uptime: "98.5%", status: "warning" },
    { name: "API Gateway", uptime: "99.9%", status: "healthy" },
  ];

  const statusStyles = {
    healthy: "text-green-600 bg-primary/20",
    warning: "text-yellow-600 bg-warning/20",
    critical: "text-red-600 bg-error/20",
  };

  const dotStyles = {
    healthy: "bg-green-500",
    warning: "bg-yellow-500",
    critical: "bg-red-500",
  };

  return (
    <main className="min-h-screen bg-background py-6">
      <div className="container max-w-screen-xl mx-auto px-4">
        {/* Page Heading */}
        <h1 className="text-2xl md:text-4xl font-bold mb-4">System Health</h1>

        {/* Card */}
        <div className="card bg-surface border border-card-border rounded-lg shadow-sm">
          <div className="card__header border-b border-card-border-inner p-4">
            <h3 className="text-xl font-semibold">Service Status</h3>
          </div>

          <div className="p-4 space-y-4">
            {services.map((service, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-secondary p-4 rounded-md"
              >
                <div>
                  <h4 className="text-md font-medium">{service.name}</h4>
                  <p className="text-sm text-text-secondary">
                    Uptime: {service.uptime}
                  </p>
                </div>
                <div
                  className={`flex items-center gap-2 text-sm font-medium py-1 px-2 rounded-md capitalize ${statusStyles[service.status]}`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${dotStyles[service.status]}`}
                  ></div>
                  {service.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};
