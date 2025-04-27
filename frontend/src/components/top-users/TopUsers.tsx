import React from 'react';

const TopUsers: React.FC = () => {
  const users = [
    {
      id: 1,
      name: 'Molly',
      points: 1234,
      avatar: 'https://randomuser.me/api/portraits/women/72.jpg',
    },
    {
      id: 2,
      name: 'Phill | EasyA',
      points: 987,
      avatar: 'https://randomuser.me/api/portraits/men/40.jpg',
    },
    {
      id: 3,
      name: 'Charllot',
      points: 876,
      avatar: 'https://randomuser.me/api/portraits/women/54.jpg',
    },
    {
      id: 4,
      name: 'Michael Chen',
      points: 765,
      avatar: 'https://randomuser.me/api/portraits/men/83.jpg',
    },
    {
      id: 5,
      name: 'Mia Davis',
      points: 654,
      avatar: 'https://randomuser.me/api/portraits/women/17.jpg',
    },
  ];

  return (
    <div className="bg-white w-500 shadow-md rounded-md overflow-hidden max-w-lg mx-auto ">
      <div className="bg-gray-100 py-2 px-4">
        <h2 className="text-xl font-semibold text-gray-800">Top Users</h2>
      </div>
      <ul className="divide-y divide-gray-200">
        {users.map((user, index) => (
          <li key={user.id} className="flex items-center py-4 px-6">
            <span className="text-gray-700 text-lg font-medium mr-4">
              {index + 1}.
            </span>
            <img
              className="w-12 h-12 rounded-full object-cover mr-4"
              src={user.avatar}
              alt={`${user.name} avatar`}
            />
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-800">{user.name}</h3>
              <p className="text-gray-600 text-base">{user.points} points</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopUsers;
