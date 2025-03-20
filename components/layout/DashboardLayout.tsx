import { useEffect, useState, useRef, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHome,
    faUser,
    faSignOutAlt,
    faUsers,
    faCog,
    faAngleDown,
    IconDefinition
} from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../pages/_app';
import { logout } from '@/utils/auth';
import { toast } from 'react-toastify';
import FullPageLoader from '@/components/ui/FullPageLoader';
import ProtectedElement from '../ui/ProtectedElements';

interface MenuItem {
    label: string;
    path?: string;
    icon: IconDefinition;
    roleAccess?: Array<string>;
    children?: {
        label: string;
        path: string;
        icon: IconDefinition;
    }[];
}

// Example menu
const menuItems: MenuItem[] = [
    {
        label: 'Home',
        path: '/dashboard',
        icon: faHome
    },
    {
        label: 'Administrator',
        icon: faUsers,
        roleAccess: ['admin'],
        children: [
            { label: 'Manage Users', path: '/dashboard/admin/users', icon: faUser }
        ]
    },
    {
        label: 'Account',
        icon: faCog,
        children: [
            {
                label: 'Account Information',
                path: '/dashboard/account/info',
                icon: faUser
            },
            {
                label: 'Account Settings',
                path: '/dashboard/account/settings',
                icon: faCog
            }
        ]
    }
];

export default function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { authenticated, user, setAuth } = useContext(AuthContext);

    // Track breakpoints
    const [isDesktop, setIsDesktop] = useState(false);
    const [isTablet, setIsTablet] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Sidebar states
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Track which parents are expanded
    const [parentOpen, setParentOpen] = useState(
        menuItems.map(() => false)
    );

    // User menu in navbar
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    const handleLogout = async () => {
        const logoutPromise = logout(setAuth);
        await toast.promise(
        logoutPromise, 
        {
            pending: "Logging out...",
            success: "Logged out successfully",
            error: "Failed to log out"
        }
        );
        router.push('/')
    }

    // Close user menu on click outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(e.target as Node)
            ) {
                setUserMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Watch screen size
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setIsDesktop(width >= 1024);
            setIsTablet(width >= 640 && width < 1024);
            setIsMobile(width < 640);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Set defaults when device changes
    useEffect(() => {
        if (isDesktop) {
            setSidebarCollapsed(false); // open
            setSidebarOpen(true);
        } else if (isTablet) {
            setSidebarCollapsed(true); // collapsed
            setSidebarOpen(true);
        } else {
            // mobile
            setSidebarCollapsed(false);
            setSidebarOpen(false);
        }
    }, [isDesktop, isTablet, isMobile]);

    // Expand any parent if current route is in child
    useEffect(() => {
        const newStates = menuItems.map((item) => {
            if (!item.children) return false;
            return item.children.some((child) => child.path === router.pathname);
        });
        setParentOpen(newStates);
    }, [router.pathname]);

    // Sidebar toggle
    const toggleSidebar = () => {
        if (isMobile) {
            setSidebarOpen(!sidebarOpen);
        } else {
            setSidebarCollapsed(!sidebarCollapsed);
        }
    };

    // Toggle parent
    const toggleParent = (i: number) => {
        const updated = [...parentOpen];
        updated[i] = !updated[i];
        setParentOpen(updated);
    };

    // Check if a link is the active route
    const isActive = (path: string) => router.pathname === path;

    return (
        <>
            <FullPageLoader isLoading={!authenticated} />
            <div className="flex min-h-screen bg-gray-100 relative dashboard">
                {/* SIDEBAR */}
                <aside
                    className={`fixed top-0 left-0 h-screen bg-gray-800 text-white flex flex-col transition-transform duration-300 z-40 overflow-hidden
          ${isMobile
                            ? sidebarOpen
                                ? 'translate-x-0 w-full'
                                : '-translate-x-full w-full'
                            : sidebarCollapsed
                                ? 'w-16'
                                : 'w-64'
                        }
        `}
                >
                    {/* Top (scrollable) */}
                    <div className="flex-1 flex flex-col overflow-y-auto">
                        {/* Sidebar Header */}
                        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700">
                            {!sidebarCollapsed && !isMobile && (
                                <span className="font-bold text-lg">Dashboard</span>
                            )}
                            {isMobile && (
                                <button
                                    onClick={toggleSidebar}
                                    className="text-white text-xl"
                                >
                                    X
                                </button>
                            )}
                        </div>

                        {/* Menu Items */}
                        <nav className="mt-2">
                            {menuItems.map((item, i) => {
                                const hasChildren = item.children && item.children.length > 0;
                                const expanded = parentOpen[i];
                                // Parent highlight if direct path matches or any child is active
                                const isParentActive =
                                    (item.path && isActive(item.path)) ||
                                    (hasChildren &&
                                        item?.children?.some((c) => isActive(c.path)));

                                return (
                                    <ProtectedElement key={i} requiredRoles={item.roleAccess}>
                                        {/* Parent Button */}
                                        <button
                                            onClick={() => {
                                                if (hasChildren) toggleParent(i);
                                                else if (item.path) router.push(item.path);
                                            }}
                                            className={`
                      w-full flex items-center px-4 py-2
                      transition-colors duration-200
                      hover:bg-gray-700
                      ${isParentActive ? 'bg-gray-700' : 'bg-gray-800'}
                    `}
                                        >
                                            <FontAwesomeIcon icon={item.icon} className="mr-2 text-xl" />
                                            <span
                                                className={`
                        flex-1 text-left
                        ${sidebarCollapsed ? 'hidden' : 'block'}
                      `}
                                            >
                                                {item.label}
                                            </span>
                                            {hasChildren && !sidebarCollapsed && (
                                                <FontAwesomeIcon
                                                    icon={faAngleDown}
                                                    className={`
                          ml-auto transform transition-transform duration-300
                          ${expanded ? 'rotate-180' : ''}
                        `}
                                                />
                                            )}
                                        </button>

                                        {/* Child Items */}
                                        {hasChildren && (
                                            <div
                                                className={`
                        bg-gray-800 overflow-hidden
                        transition-all duration-300
                        ${expanded ? 'max-h-96' : 'max-h-0'}
                      `}
                                            >
                                                {item?.children?.map((child, j) => (
                                                    <Link href={child.path} key={j}>
                                                        <div
                                                            className={`
                              flex items-center px-8 py-2
                              transition-colors duration-200
                              hover:bg-gray-700
                              ${isActive(child.path)
                                                                    ? 'bg-gray-600'
                                                                    : 'bg-gray-800'
                                                                }
                            `}
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={child.icon}
                                                                className="mr-2 text-lg"
                                                            />
                                                            <span
                                                                className={`${sidebarCollapsed ? 'hidden' : 'block'
                                                                    }`}
                                                            >
                                                                {child.label}
                                                            </span>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </ProtectedElement>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Bottom (Logout) */}
                    <div className="border-t border-gray-700">
                        <button
                            onClick={handleLogout}
                            className={`
              w-full px-4 py-3 flex items-center
              bg-red-600 hover:bg-red-700
              transition-colors duration-200
            `}
                        >
                            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                            <span className={`${sidebarCollapsed ? 'hidden' : 'block'}`}>
                                Log Out
                            </span>
                        </button>
                    </div>
                </aside>

                {/* Backdrop for Mobile */}
                {isMobile && sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-30"
                        onClick={toggleSidebar}
                    />
                )}

                {/* MAIN CONTENT */}
                <div
                    className={`
          flex flex-col flex-1
          transition-all duration-300
          ${isMobile ? 'ml-0' : sidebarCollapsed ? 'ml-16' : 'ml-64'}
        `}
                >
                    {/* NAVBAR */}
                    <header className="h-16 bg-white shadow flex items-center justify-between px-4">
                        <button
                            onClick={toggleSidebar}
                            className="text-gray-700 text-2xl mr-2"
                        >
                            &#9776;
                        </button>
                        {/* Title or branding */}
                        <div className="font-bold">Authentication Module <span className='text-xs font-normal'>by <a href='https://github.com/lautaroayosa/' target='_blank' className='text-blue-500 underline underline-offset-2 hover:text-blue-700'>Lautaro Ayosa</a></span></div>

                        {/* User Menu */}
                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition focus:outline-none"
                            >
                                <div className="bg-blue-500 text-white rounded-full h-8 w-8 flex items-center justify-center font-semibold">
                                    {user?.name.slice(0, 1)}
                                </div>
                                <span className="font-medium text-gray-800 capitalize">{user?.name}</span>
                                <FontAwesomeIcon icon={faAngleDown} className="text-gray-600" />
                            </button>
                            {userMenuOpen && (
                                <div
                                    className="
                  absolute right-0 mt-2 w-56 bg-white border border-gray-200 
                  rounded-lg shadow-lg py-2
                  after:content-[''] after:absolute after:top-[-8px] after:right-6
                  after:border-8 after:border-transparent after:border-b-white
                "
                                >
                                    <Link href="/dashboard/account/info">
                                        <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                            Account
                                        </div>
                                    </Link>
                                    <Link href="/">
                                        <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                            Leave dashboard
                                        </div>
                                    </Link>
                                    <div onClick={handleLogout}>
                                        <div className="px-4 py-2 hover:bg-red-600 hover:text-white cursor-pointer">
                                            Log Out
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </header>

                    {/* PAGE CONTENT */}
                    <main className="p-4">{children}</main>
                </div>
            </div>
        </>
    );
}
