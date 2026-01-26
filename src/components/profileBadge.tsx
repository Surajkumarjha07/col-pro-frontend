import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { Link } from 'react-router-dom';
import { clearToken } from '../redux/slices/user';

export default function ProfileBadge() {
    const user = useAppSelector(state => state.User.user);
    const {isProfileBadgeOpen} = useAppSelector(state => state.ProfileBadgeState);
    const dispatch = useAppDispatch();
    // const token = useAppSelector(state => state.User.token);

    const handleSignOut = () => {
        localStorage.removeItem("token");
        dispatch(clearToken());
        window.location.reload();
    }

    return (
        <section className={`${isProfileBadgeOpen ? "visible" : "hidden"} profilebadge absolute top-20 right-0 z-30 bg-white shadow-lg shadow-gray-500 rounded-xl px-6 py-4 w-fit flex justify-center items-center gap-8`}>

            <div className="profile w-16 h-16 rounded-full bg-linear-to-tr from-gray-400 to-gray-800 flex items-center justify-center text-white font-semibold text-xl cursor-pointer">
                <p className='pointer-events-none text-2xl'>
                    {
                        (user as any).name?.charAt(0).toUpperCase() ?? "S"
                    }
                </p>
            </div>

            <div className='flex flex-col justify-center items-start gap-1'>
                <div className='-space-y-0.5'>
                    <p className='text-[1.1rem] font-semibold'> {(user as any).name} </p>
                    <p className='text-sm font-medium text-gray-600'> {(user as any).email} </p>
                </div>

                <div>
                    <Link to={"/manage-account"}>
                    <button className='text-blue-500 text-sm cursor-pointer font-semibold'>
                        Manage Account
                    </button>
                    </Link>
                </div>

                <button className='text-blue-500 text-sm cursor-pointer font-semibold' onClick={handleSignOut}>
                    Sign Out
                </button>
            </div>

        </section>
    );
}