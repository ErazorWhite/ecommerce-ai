import './PerformanceMetrics.css';

interface PerformanceMetricsProps {
  clientLatency?: number;
  serverLatency?: number;
  totalLatency?: number;
  protocol: 'REST' | 'gRPC';
}

export const PerformanceMetrics = ({
  clientLatency,
  serverLatency,
  totalLatency,
  protocol,
}: PerformanceMetricsProps) => {
  if (!clientLatency && !serverLatency && !totalLatency) {
    return null;
  }

  return (
    <div className="performance-metrics">
      <div className="metrics-header">
        <span className="metrics-icon">⚡</span>
        <span className="metrics-title">Performance Metrics ({protocol})</span>
      </div>
      <div className="metrics-grid">
        {totalLatency !== undefined && (
          <div className="metric-item">
            <span className="metric-label">Total Time</span>
            <span className="metric-value">{totalLatency.toFixed(2)} ms</span>
          </div>
        )}
        {clientLatency !== undefined && (
          <div className="metric-item">
            <span className="metric-label">Client Time</span>
            <span className="metric-value">{clientLatency.toFixed(2)} ms</span>
          </div>
        )}
        {serverLatency !== undefined && (
          <div className="metric-item">
            <span className="metric-label">Server Time</span>
            <span className="metric-value">{serverLatency.toFixed(2)} ms</span>
          </div>
        )}
      </div>
    </div>
  );
};
