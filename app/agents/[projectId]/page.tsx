'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LiveKitRoom, RoomAudioRenderer, ControlBar } from '@livekit/components-react';

interface Project {
    id: string;
    agentName: string;
    businessName?: string;
    language: string;
    services?: any[];
    schedule?: any;
    createdAt: string;
    updatedAt: string;
}

export default function AgentPage({ params }: { params: Promise<{ projectId: string }> }) {
    // Unwrap the params Promise using React.use()
    const unwrappedParams = use(params);
    const projectId = unwrappedParams.projectId;

    const router = useRouter();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // LiveKit token state
    const [tokenLoading, setTokenLoading] = useState(false);
    const [tokenError, setTokenError] = useState<string | null>(null);
    const [livekitToken, setLivekitToken] = useState<string | null>(null);
    const [livekitUrl, setLivekitUrl] = useState<string | null>(null);
    const [roomName, setRoomName] = useState<string | null>(null);

    useEffect(() => {
        fetchProject();
    }, [projectId]);

    const fetchProject = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`/api/projects/${projectId}`, {
                credentials: 'include',
            });

            if (!response.ok) {
                if (response.status === 401) {
                    router.push('/');
                    return;
                }
                throw new Error('Failed to fetch project');
            }

            const data = await response.json();
            setProject(data.data);
        } catch (err: any) {
            console.error('Error fetching project:', err);
            setError(err.message || 'Failed to load project');
        } finally {
            setLoading(false);
        }
    };

    // Handle Start Call - Fetch LiveKit Token
    const handleStartCall = async () => {
        try {
            setTokenLoading(true);
            setTokenError(null);

            console.log('🔄 Requesting LiveKit token for project:', projectId);

            const response = await fetch('/api/livekit/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ projectId }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Failed to get token');
            }

            console.log('✅ LiveKit Token Received:');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('📦 Full Response:', data);
            console.log('🎫 Token:', data.data.token);
            console.log('🏠 Room:', data.data.room);
            console.log('👤 Identity:', data.data.identity);
            console.log('🔗 URL:', data.data.url);
            console.log('🤖 Agent:', data.data.project.agentName);
            console.log('🏢 Business:', data.data.project.businessName);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

            // Store token and connection info for LiveKitRoom
            setLivekitToken(data.data.token);
            setLivekitUrl(data.data.url);
            setRoomName(data.data.room);

            console.log('✅ LiveKit connection established!');


        } catch (err: any) {
            console.error('❌ Token Error:', err);
            setTokenError(err.message || 'Failed to get LiveKit token');
            alert(`❌ Failed to get token: ${err.message}`);
        } finally {
            setTokenLoading(false);
        }
    };

    // Handle disconnect
    const handleDisconnect = () => {
        setLivekitToken(null);
        setLivekitUrl(null);
        setRoomName(null);
        console.log('🔌 Disconnected from LiveKit room');
    };

    return (
        <>
            <style jsx global>{`
                .sidebar {
                    width: 240px;
                    flex-shrink: 0;
                    background: var(--surface);
                    border-right: 1px solid var(--border);
                    display: flex;
                    flex-direction: column;
                    padding: 28px 0;
                    position: fixed;
                    top: 0;
                    left: 0;
                    height: 100vh;
                    z-index: 50;
                }
                .sidebar-logo {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 0 24px 28px;
                    border-bottom: 1px solid var(--border);
                    font-family: var(--font-display);
                    font-size: 26px;
                    font-weight: 600;
                    letter-spacing: 0.1em;
                    color: var(--white);
                    text-decoration: none;
                }
                .logo-dot {
                    width: 8px;
                    height: 8px;
                    background: var(--gold);
                    border-radius: 50%;
                }
                .sidebar-nav {
                    padding: 20px 0;
                    flex: 1;
                }
                .nav-section-label {
                    padding: 6px 24px 4px;
                    font-family: var(--font-mono);
                    font-size: 9px;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                    color: var(--muted);
                }
                .nav-item {
                    display: flex;
                    align-items: center;
                    gap: 11px;
                    padding: 10px 24px;
                    color: var(--muted);
                    font-size: 13px;
                    text-decoration: none;
                    letter-spacing: 0.02em;
                    cursor: pointer;
                    transition: all 0.2s;
                    border-left: 2px solid transparent;
                }
                .nav-item:hover {
                    color: var(--text);
                    background: rgba(255, 255, 255, 0.02);
                }
                .nav-item.active {
                    color: var(--gold);
                    border-left-color: var(--gold);
                    background: rgba(201, 168, 76, 0.04);
                }
                .main-content {
                    flex: 1;
                    margin-left: 240px;
                    min-height: 100vh;
                }
                .topbar {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 20px 40px;
                    border-bottom: 1px solid var(--border);
                    background: rgba(8, 8, 8, 0.8);
                    backdrop-filter: blur(12px);
                    position: sticky;
                    top: 0;
                    z-index: 40;
                }
                .content-area {
                    padding: 40px;
                }
            `}</style>

            <div style={{ display: 'flex', minHeight: '100vh' }}>
                {/* Sidebar */}
                <aside className="sidebar">
                    <Link href="/" className="sidebar-logo">
                        <div className="logo-dot"></div> Zara
                    </Link>
                    <nav className="sidebar-nav">
                        <div className="nav-section-label">Workspace</div>
                        <Link href="/dashboard" className="nav-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: '15px', height: '15px' }}>
                                <rect x="3" y="3" width="7" height="7" rx="1" />
                                <rect x="14" y="3" width="7" height="7" rx="1" />
                                <rect x="3" y="14" width="7" height="7" rx="1" />
                                <rect x="14" y="14" width="7" height="7" rx="1" />
                            </svg>
                            Projects
                        </Link>
                        <div className="nav-item active">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: '15px', height: '15px' }}>
                                <circle cx="12" cy="12" r="10" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                            Agent View
                        </div>
                    </nav>

                    <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, var(--gold-dk), var(--gold))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px',
                                fontWeight: '600',
                                color: 'var(--black)',
                            }}>A</div>
                            <div>
                                <div style={{ fontSize: '12px', color: 'var(--text)', fontWeight: '500' }}>Admin</div>
                                <div style={{ fontSize: '10px', color: 'var(--muted)' }}>Pro Plan</div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="main-content">
                    {/* Topbar */}
                    <div className="topbar">
                        <div>
                            <h1 style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '18px',
                                fontWeight: '400',
                                color: 'var(--white)',
                                letterSpacing: '0.02em',
                            }}>
                                Agent Dashboard
                            </h1>
                            <p style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '1px' }}>
                                View and manage your AI voice agent
                            </p>
                        </div>
                        <Link
                            href="/dashboard"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 24px',
                                background: 'transparent',
                                color: 'var(--muted)',
                                fontFamily: 'var(--font-body)',
                                fontSize: '12px',
                                fontWeight: '600',
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                                border: '1px solid var(--border)',
                                textDecoration: 'none',
                                transition: 'all 0.3s',
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.borderColor = 'var(--gold)';
                                e.currentTarget.style.color = 'var(--gold)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.borderColor = 'var(--border)';
                                e.currentTarget.style.color = 'var(--muted)';
                            }}
                        >
                            ← Back to Dashboard
                        </Link>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div style={{
                            textAlign: 'center',
                            padding: '100px 20px',
                            color: 'var(--muted)',
                        }}>
                            <div style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '12px',
                                letterSpacing: '0.1em',
                            }}>
                                Loading agent information...
                            </div>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !loading && (
                        <div style={{
                            margin: '60px auto',
                            maxWidth: '600px',
                            textAlign: 'center',
                            padding: '40px 20px',
                            color: 'var(--error, #ff6b6b)',
                            border: '1px solid var(--border)',
                            background: 'var(--card)',
                        }}>
                            <p style={{ marginBottom: '16px' }}>{error}</p>
                            <button
                                onClick={fetchProject}
                                style={{
                                    padding: '12px 28px',
                                    background: 'var(--gold)',
                                    color: 'var(--black)',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.08em',
                                }}
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {/* Agent Header - UI Wrapper */}
                    {!loading && !error && project && (
                        <>
                            {/* Hero Header with Agent Name and Business Name */}
                            <div style={{
                                background: 'linear-gradient(180deg, rgba(201, 168, 76, 0.03) 0%, rgba(8, 8, 8, 0) 100%)',
                                borderBottom: '1px solid var(--border)',
                                padding: '60px 40px',
                            }}>
                                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                                    {/* Status Badge */}
                                    <div style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '6px 16px',
                                        background: 'rgba(82, 183, 136, 0.1)',
                                        border: '1px solid rgba(82, 183, 136, 0.3)',
                                        marginBottom: '24px',
                                    }}>
                                        <div style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            background: '#52b788',
                                            boxShadow: '0 0 8px rgba(82, 183, 136, 0.6)',
                                        }}></div>
                                        <span style={{
                                            fontFamily: 'var(--font-mono)',
                                            fontSize: '10px',
                                            letterSpacing: '0.12em',
                                            textTransform: 'uppercase',
                                            color: '#52b788',
                                        }}>
                                            Active Agent
                                        </span>
                                    </div>

                                    {/* Agent Name - Primary */}
                                    <h1 style={{
                                        fontFamily: 'var(--font-display)',
                                        fontSize: '72px',
                                        fontWeight: '300',
                                        color: 'var(--white)',
                                        lineHeight: '1',
                                        marginBottom: '16px',
                                        letterSpacing: '-0.02em',
                                    }}>
                                        {project.agentName}
                                    </h1>

                                    {/* Business Name - Secondary */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        marginBottom: '32px',
                                    }}>
                                        <div style={{
                                            fontFamily: 'var(--font-mono)',
                                            fontSize: '11px',
                                            letterSpacing: '0.12em',
                                            textTransform: 'uppercase',
                                            color: 'var(--gold)',
                                        }}>
                                            Business
                                        </div>
                                        <div style={{
                                            width: '4px',
                                            height: '4px',
                                            borderRadius: '50%',
                                            background: 'var(--border)',
                                        }}></div>
                                        <div style={{
                                            fontFamily: 'var(--font-body)',
                                            fontSize: '20px',
                                            color: 'var(--white)',
                                            fontWeight: '300',
                                        }}>
                                            {project.businessName || 'No business name set'}
                                        </div>
                                    </div>

                                    {/* Quick Stats */}
                                    <div style={{
                                        display: 'flex',
                                        gap: '32px',
                                        paddingTop: '24px',
                                        borderTop: '1px solid var(--border)',
                                    }}>
                                        <div>
                                            <div style={{
                                                fontFamily: 'var(--font-mono)',
                                                fontSize: '9px',
                                                letterSpacing: '0.14em',
                                                textTransform: 'uppercase',
                                                color: 'var(--muted)',
                                                marginBottom: '6px',
                                            }}>Language</div>
                                            <div style={{
                                                fontSize: '14px',
                                                color: 'var(--white)',
                                            }}>
                                                {project.language || 'English'}
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{
                                                fontFamily: 'var(--font-mono)',
                                                fontSize: '9px',
                                                letterSpacing: '0.14em',
                                                textTransform: 'uppercase',
                                                color: 'var(--muted)',
                                                marginBottom: '6px',
                                            }}>Services</div>
                                            <div style={{
                                                fontSize: '14px',
                                                color: 'var(--white)',
                                            }}>
                                                {project.services?.length || 0} configured
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{
                                                fontFamily: 'var(--font-mono)',
                                                fontSize: '9px',
                                                letterSpacing: '0.14em',
                                                textTransform: 'uppercase',
                                                color: 'var(--muted)',
                                                marginBottom: '6px',
                                            }}>Project ID</div>
                                            <div style={{
                                                fontSize: '14px',
                                                color: 'var(--white)',
                                                fontFamily: 'var(--font-mono)',
                                            }}>
                                                {project.id.substring(0, 8)}...
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="content-area">
                                {/* Show Start Call Button if not connected */}
                                {!livekitToken && (
                                    <div style={{
                                        background: 'var(--card)',
                                        border: '1px solid var(--border)',
                                        padding: '64px 48px',
                                        textAlign: 'center',
                                    }}>
                                        <div style={{
                                            fontFamily: 'var(--font-mono)',
                                            fontSize: '11px',
                                            letterSpacing: '0.12em',
                                            textTransform: 'uppercase',
                                            color: 'var(--gold)',
                                            marginBottom: '24px',
                                        }}>
                                            Voice Agent Interface
                                        </div>

                                        {/* Start Call Button */}
                                        <button
                                            onClick={handleStartCall}
                                            disabled={tokenLoading}
                                            style={{
                                                padding: '18px 48px',
                                                background: tokenLoading
                                                    ? 'var(--muted)'
                                                    : 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dk) 100%)',
                                                color: tokenLoading ? 'var(--text)' : 'var(--black)',
                                                fontFamily: 'var(--font-body)',
                                                fontSize: '14px',
                                                fontWeight: '700',
                                                letterSpacing: '0.1em',
                                                textTransform: 'uppercase',
                                                border: 'none',
                                                cursor: tokenLoading ? 'not-allowed' : 'pointer',
                                                transition: 'all 0.3s',
                                                opacity: tokenLoading ? 0.6 : 1,
                                            }}
                                            onMouseOver={(e) => {
                                                if (!tokenLoading) {
                                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(201, 168, 76, 0.3)';
                                                }
                                            }}
                                            onMouseOut={(e) => {
                                                if (!tokenLoading) {
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                    e.currentTarget.style.boxShadow = 'none';
                                                }
                                            }}
                                        >
                                            {tokenLoading ? '⏳ Connecting...' : '🎙️ Start Call'}
                                        </button>

                                        {/* Token Error Display */}
                                        {tokenError && (
                                            <div style={{
                                                marginTop: '24px',
                                                padding: '16px',
                                                background: 'rgba(255, 107, 107, 0.1)',
                                                border: '1px solid rgba(255, 107, 107, 0.3)',
                                                color: '#ff6b6b',
                                                fontSize: '13px',
                                            }}>
                                                ⚠️ {tokenError}
                                            </div>
                                        )}

                                        <div style={{
                                            marginTop: '32px',
                                            fontSize: '12px',
                                            color: 'var(--muted)',
                                            lineHeight: '1.6',
                                        }}>
                                            Click "Start Call" to connect with the voice agent.<br />
                                            Connection status will appear in the console.
                                        </div>
                                    </div>
                                )}

                                {/* Show LiveKit Room when connected */}
                                {livekitToken && livekitUrl && (
                                    <div style={{
                                        background: 'var(--card)',
                                        border: '1px solid var(--border)',
                                        padding: '32px',
                                        minHeight: '400px',
                                    }}>
                                        <div style={{
                                            marginBottom: '24px',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}>
                                            <div>
                                                <div style={{
                                                    fontFamily: 'var(--font-mono)',
                                                    fontSize: '11px',
                                                    letterSpacing: '0.12em',
                                                    textTransform: 'uppercase',
                                                    color: 'var(--gold)',
                                                }}>
                                                    Connected to Room
                                                </div>
                                                <div style={{
                                                    marginTop: '8px',
                                                    fontSize: '12px',
                                                    color: 'var(--muted)',
                                                    fontFamily: 'var(--font-mono)',
                                                }}>
                                                    {roomName}
                                                </div>
                                            </div>
                                            <button
                                                onClick={handleDisconnect}
                                                style={{
                                                    padding: '10px 24px',
                                                    background: 'transparent',
                                                    color: 'var(--text)',
                                                    border: '1px solid var(--border)',
                                                    fontFamily: 'var(--font-body)',
                                                    fontSize: '12px',
                                                    fontWeight: '600',
                                                    letterSpacing: '0.05em',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s',
                                                }}
                                            >
                                                Disconnect
                                            </button>
                                        </div>

                                        {/* LiveKit Room Component */}
                                        <LiveKitRoom
                                            token={livekitToken}
                                            serverUrl={livekitUrl}
                                            connect={true}
                                            style={{
                                                minHeight: '300px',
                                                background: 'var(--black)',
                                                borderRadius: '4px',
                                            }}
                                        >
                                            <div style={{
                                                padding: '32px',
                                                textAlign: 'center',
                                                color: 'var(--text)',
                                            }}>
                                                <div style={{
                                                    fontSize: '14px',
                                                    marginBottom: '16px',
                                                }}>
                                                    🎙️ Voice Agent Active
                                                </div>
                                                <div style={{
                                                    fontSize: '12px',
                                                    color: 'var(--muted)',
                                                }}>
                                                    You're now connected to {project?.agentName}
                                                </div>
                                            </div>

                                            {/* LiveKit Audio Renderer */}
                                            <RoomAudioRenderer />

                                            {/* LiveKit Control Bar */}
                                            <ControlBar />
                                        </LiveKitRoom>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </main>
            </div>
        </>
    );
}
