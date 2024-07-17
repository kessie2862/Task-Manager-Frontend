import { useState, useEffect } from 'react';
import { getTaskSummary } from '../services/api';
import { Bar, Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import { motion } from 'framer-motion';

const Dashboard = ({ token }) => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await getTaskSummary(token);
        setSummary(data);
      } catch (err) {
        console.error('Failed to fetch task summary', err);
      }
    };

    fetchSummary();
  }, [token]);

  if (!summary) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  const taskStatusData = {
    labels: ['Completed', 'In Progress', 'Overdue'],
    datasets: [
      {
        label: 'Created Tasks',
        data: [
          summary.completed_created_tasks,
          summary.in_progress_created_tasks,
          summary.overdue_created_tasks,
        ],
        backgroundColor: ['#34D399', '#FBBF24', '#F87171'],
      },
      {
        label: 'Assigned Tasks',
        data: [
          summary.completed_assigned_tasks,
          summary.in_progress_assigned_tasks,
          summary.overdue_assigned_tasks,
        ],
        backgroundColor: ['#60A5FA', '#F59E0B', '#EF4444'],
      },
    ],
  };

  const barChartData = {
    labels: ['Total Created Tasks', 'Total Assigned Tasks'],
    datasets: [
      {
        label: 'Tasks',
        data: [summary.total_created_tasks, summary.total_assigned_tasks],
        backgroundColor: ['#4F46E5', '#6366F1'],
      },
    ],
  };

  const taskDetails = [
    {
      label: 'Total Created Tasks',
      value: summary.total_created_tasks,
      color: 'bg-purple-500',
    },
    {
      label: 'Total Assigned Tasks',
      value: summary.total_assigned_tasks,
      color: 'bg-indigo-500',
    },
    {
      label: 'Completed Created Tasks',
      value: summary.completed_created_tasks,
      color: 'bg-green-500',
    },
    {
      label: 'Completed Assigned Tasks',
      value: summary.completed_assigned_tasks,
      color: 'bg-blue-500',
    },
    {
      label: 'In Progress Created Tasks',
      value: summary.in_progress_created_tasks,
      color: 'bg-yellow-500',
    },
    {
      label: 'In Progress Assigned Tasks',
      value: summary.in_progress_assigned_tasks,
      color: 'bg-orange-500',
    },
    {
      label: 'Overdue Created Tasks',
      value: summary.overdue_created_tasks,
      color: 'bg-red-500',
    },
    {
      label: 'Overdue Assigned Tasks',
      value: summary.overdue_assigned_tasks,
      color: 'bg-pink-500',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 mt-4">Task Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-2">Task Status Overview</h3>
          <Doughnut data={taskStatusData} />
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-2">Total Tasks</h3>
          <Bar data={barChartData} />
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg p-4 mt-4">
        <h3 className="text-xl font-semibold mb-2">Task Details</h3>
        <motion.ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {taskDetails.map((task, index) => (
            <motion.li
              key={index}
              className={`p-4 rounded-lg shadow-md text-white ${task.color} transition-transform hover:scale-105`}
              variants={cardVariants}
            >
              <h4 className="text-lg font-semibold mb-2">{task.label}</h4>
              <p className="text-2xl font-bold">{task.value}</p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </div>
  );
};

export default Dashboard;
