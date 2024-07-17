import { useEffect, useState } from 'react';
import { getTasks, deleteTask, toggleTaskCompletion } from '../../services/api';
import { toast } from 'react-toastify';
import '@fortawesome/fontawesome-free/css/all.min.css';
import TaskFilters from './TaskFilters';
import TaskTable from './TaskTable';
import '../../index.css';

const TaskList = ({ token }) => {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks(token);
        setTasks(data);
      } catch (err) {
        console.error('Failed to fetch tasks', err);
      }
    };

    fetchTasks();
  }, [token]);

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId, token);
      setTasks(tasks.filter((task) => task.id !== taskId));
      toast.success('Task deleted successfully');
    } catch (err) {
      console.error('Failed to delete task', err);
      toast.error('Failed to delete task');
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const newStatus =
        task.status === 'completed' ? 'in_progress' : 'completed';
      const updatedTask = await toggleTaskCompletion(task.id, newStatus, token);
      setTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)));
      toast.success(
        `Task ${
          newStatus === 'completed' ? 'completed' : 'marked in progress'
        } successfully`
      );
    } catch (err) {
      console.error('Failed to toggle task completion', err);
      toast.error('Failed to update task status');
    }
  };

  const filteredTasks = tasks.filter(
    (task) =>
      (task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (statusFilter === 'all' || task.status === statusFilter)
  );

  filteredTasks.sort((a, b) => b.id - a.id);

  return (
    <div className="container">
      <TaskFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {filteredTasks.length === 0 ? (
        <div className="alert alert-warning">
          No tasks match your search criteria.
        </div>
      ) : (
        <TaskTable
          tasks={filteredTasks}
          handleDelete={handleDelete}
          handleToggleComplete={handleToggleComplete}
        />
      )}
    </div>
  );
};

export default TaskList;
