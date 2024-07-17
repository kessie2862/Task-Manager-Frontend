import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createTask, getUsers, updateTask } from '../services/api';
import { toast } from 'react-toastify';

const TaskForm = ({ token }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentTask = location.state?.currentTask || null;

  const [title, setTitle] = useState(currentTask ? currentTask.title : '');
  const [description, setDescription] = useState(
    currentTask ? currentTask.description : ''
  );
  const [dueDate, setDueDate] = useState(
    currentTask ? currentTask.due_date : ''
  );
  const [status, setStatus] = useState(
    currentTask ? currentTask.status : 'open'
  );
  const [assignedUser, setAssignedUser] = useState(
    currentTask ? currentTask.assigned_user.id : ''
  );
  const [users, setUsers] = useState([]);
  const [formOpen, setFormOpen] = useState(true);

  // State variables for validation errors
  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [dueDateError, setDueDateError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers(token);
        setUsers(data);
      } catch (err) {
        console.error('Failed to fetch users', err);
      }
    };

    fetchUsers();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation logic
    let isValid = true;

    if (!title.trim()) {
      setTitleError('Title is required.');
      isValid = false;
    } else {
      setTitleError('');
    }

    if (!description.trim()) {
      setDescriptionError('Description is required.');
      isValid = false;
    } else {
      setDescriptionError('');
    }

    if (!dueDate) {
      setDueDateError('Due Date is required.');
      isValid = false;
    } else {
      setDueDateError('');
    }

    if (!isValid) {
      return;
    }

    const taskData = {
      title,
      description,
      due_date: dueDate,
      status,
      assigned_user_id: assignedUser,
    };

    try {
      if (currentTask) {
        await updateTask(currentTask.id, taskData, token);
        toast.success('Task updated successfully');
      } else {
        await createTask(taskData, token);
        toast.success('Task created successfully');
      }
      navigate('/tasks');
    } catch (err) {
      console.error('Failed to save task', err);
      toast.error('Failed to save task');
    }
  };

  const handleClose = () => {
    setFormOpen(false);
    navigate('/tasks');
  };

  if (!formOpen) {
    return null;
  }

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-12">
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
        onClick={handleClose}
      >
        <svg
          className="w-5 h-5"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M14.293 5.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 111.414-1.414L10 8.586l4.293-4.293z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <form
        onSubmit={handleSubmit}
        className="p-6 space-y-6 bg-white dark:bg-gray-900 rounded-lg"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {currentTask ? 'Edit Task' : 'Create Task'}
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="title"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Title:
            </label>
            <input
              type="text"
              id="title"
              className={`shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                titleError ? 'border-red-500' : ''
              }`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {titleError && <p className="text-sm text-red-500">{titleError}</p>}
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="description"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Description:
            </label>
            <textarea
              id="description"
              className={`shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                descriptionError ? 'border-red-500' : ''
              }`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {descriptionError && (
              <p className="text-sm text-red-500">{descriptionError}</p>
            )}
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="due-date"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Due Date:
            </label>
            <input
              type="date"
              id="due-date"
              className={`shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                dueDateError ? 'border-red-500' : ''
              }`}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            {dueDateError && (
              <p className="text-sm text-red-500">{dueDateError}</p>
            )}
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="status"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Status:
            </label>
            <select
              id="status"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="assigned-user"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Assign to:
            </label>
            <select
              id="assigned-user"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={assignedUser}
              onChange={(e) => setAssignedUser(e.target.value)}
            >
              <option value="">Select Assignee</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {currentTask ? 'Update Task' : 'Create Task'}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
