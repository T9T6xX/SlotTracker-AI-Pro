
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine 
} from 'recharts';

interface RTPChartProps {
  data: number[];
  baseRtp: number;
  color: string;
}

const RTPChart: React.FC<RTPChartProps> = ({ data, baseRtp, color }) => {
  const chartData = data.map((val, idx) => ({ 
    index: idx, 
    rtp: parseFloat(val.toFixed(2)) 
  }));

  const min = Math.min(...data, baseRtp) * 0.98;
  const max = Math.max(...data, baseRtp) * 1.02;

  return (
    <div className="w-full h-48 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis hide />
          <YAxis 
            domain={[min, max]} 
            hide 
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
            itemStyle={{ color: '#f8fafc', fontSize: '12px' }}
            labelStyle={{ display: 'none' }}
          />
          <ReferenceLine y={baseRtp} stroke="#ef4444" strokeDasharray="3 3" opacity={0.5} />
          <Line 
            type="monotone" 
            dataKey="rtp" 
            stroke={color} 
            strokeWidth={2} 
            dot={false} 
            animationDuration={300}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RTPChart;
