import { User } from '../../types';
import { ThumbsUp } from 'lucide-react';

interface ProfileHeaderProps {
    user: User;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-start space-x-6">
                <img
                    src={`http://localhost:3000${user.avatar}`}
                    alt={user.login}
                    className="h-24 w-24 rounded-full"
                />

                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {user.fullName}
                    </h1>
                    <p className="text-gray-500">@{user.login}</p>

                    <div className="mt-4 flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                            <ThumbsUp className="h-5 w-5 text-gray-400" />
                            <span className="text-gray-900 font-medium">
                                {user.rating}
                            </span>
                            <span className="text-gray-500">rating</span>
                        </div>
                        {/* <div className="flex items-center space-x-2">
                            <MessageSquare className="h-5 w-5 text-gray-400" />
                            <span className="text-gray-900 font-medium">
                                {user.postsCount}
                            </span>
                            <span className="text-gray-500">posts</span>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
}
