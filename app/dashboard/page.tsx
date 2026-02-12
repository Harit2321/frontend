'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Project {
    id: string;
    name: string;
    business: string;
    icon: string;
    status: 'live' | 'draft';
    language: string;
    servicesCount: number;
    schedule: string;
    bookings: number;
    calls: number;
    rate: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const [modalOpen, setModalOpen] = useState(false);
    const [newAgentName, setNewAgentName] = useState('');

    const [projects] = useState<Project[]>([
        {
            id: 'luxe-studio',
            name: 'Bella',
            business: 'Luxe Hair Studio',
            icon: '💈',
            status: 'live',
            language: 'English (US)',
            servicesCount: 7,
            schedule: 'Mon–Sat',
            bookings: 84,
            calls: 23,
            rate: '98%'
        },
        {
            id: 'pulse-fitness',
            name: 'Max',
            business: 'Pulse Fitness',
            icon: '🏋️',
            status: 'live',
            language: 'English (US)',
            servicesCount: 4,
            schedule: 'Mon–Sun',
            bookings: 64,
            calls: 19,
            rate: '94%'
        }
    ]);

    const handleCreateProject = () => {
        if (newAgentName.trim()) {
            router.push(`/wizard?name=${encodeURIComponent(newAgentName)}`);
        }
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
                        <Link href="/dashboard" className="nav-item active">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: '15px', height: '15px' }}>
                                <rect x="3" y="3" width="7" height="7" rx="1" />
                                <rect x="14" y="3" width="7" height="7" rx="1" />
                                <rect x="3" y="14" width="7" height="7" rx="1" />
                                <rect x="14" y="14" width="7" height="7" rx="1" />
                            </svg>
                            Projects
                        </Link>
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
                    <div className="topbar">
                        <div>
                            <h1 style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '24px',
                                fontWeight: '400',
                                color: 'var(--white)',
                                letterSpacing: '0.02em',
                            }}>Projects</h1>
                            <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '1px' }}>
                                Manage your AI voice booking agents
                            </p>
                        </div>
                        <button
                            onClick={() => setModalOpen(true)}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 24px',
                                background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dk) 100%)',
                                color: 'var(--black)',
                                fontFamily: 'var(--font-body)',
                                fontSize: '12px',
                                fontWeight: '700',
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                            }}
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            New Project
                        </button>
                    </div>

                    <div className="content-area">
                        {/* Stats Row */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: '1px',
                            background: 'var(--border)',
                            border: '1px solid var(--border)',
                            marginBottom: '40px',
                        }}>
                            <div style={{ background: 'var(--card)', padding: '24px 28px', position: 'relative' }}>
                                <div style={{
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '10px',
                                    letterSpacing: '0.14em',
                                    textTransform: 'uppercase',
                                    color: 'var(--muted)',
                                    marginBottom: '8px',
                                }}>Total Agents</div>
                                <div style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: '34px',
                                    fontWeight: '300',
                                    color: 'var(--white)',
                                    letterSpacing: '-0.02em',
                                    lineHeight: '1',
                                }}>{projects.length}</div>
                                <div style={{ fontSize: '11px', color: 'var(--green-lt)', marginTop: '6px' }}>
                                    ↑ {projects.filter(p => p.status === 'live').length} live
                                </div>
                            </div>

                            <div style={{ background: 'var(--card)', padding: '24px 28px' }}>
                                <div style={{
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '10px',
                                    letterSpacing: '0.14em',
                                    textTransform: 'uppercase',
                                    color: 'var(--muted)',
                                    marginBottom: '8px',
                                }}>Bookings Today</div>
                                <div style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: '34px',
                                    fontWeight: '300',
                                    color: 'var(--white)',
                                    letterSpacing: '-0.02em',
                                    lineHeight: '1',
                                }}>14</div>
                            </div>

                            <div style={{ background: 'var(--card)', padding: '24px 28px' }}>
                                <div style={{
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '10px',
                                    letterSpacing: '0.14em',
                                    textTransform: 'uppercase',
                                    color: 'var(--muted)',
                                    marginBottom: '8px',
                                }}>Calls This Month</div>
                                <div style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: '34px',
                                    fontWeight: '300',
                                    color: 'var(--white)',
                                    letterSpacing: '-0.02em',
                                    lineHeight: '1',
                                }}>148</div>
                            </div>

                            <div style={{ background: 'var(--card)', padding: '24px 28px' }}>
                                <div style={{
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '10px',
                                    letterSpacing: '0.14em',
                                    textTransform: 'uppercase',
                                    color: 'var(--muted)',
                                    marginBottom: '8px',
                                }}>Conversion Rate</div>
                                <div style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: '34px',
                                    fontWeight: '300',
                                    color: 'var(--white)',
                                    letterSpacing: '-0.02em',
                                    lineHeight: '1',
                                }}>96<span style={{ fontSize: '18px', color: 'var(--gold)' }}>%</span></div>
                            </div>
                        </div>

                        {/* Projects Grid */}
                        <div style={{ marginBottom: '20px' }}>
                            <h2 style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '22px',
                                fontWeight: '400',
                                color: 'var(--white)',
                                marginBottom: '8px',
                            }}>Your Agents</h2>
                            <p style={{ fontSize: '12px', color: 'var(--muted)' }}>Click any agent to configure or view its dashboard</p>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: '1px',
                            background: 'var(--border)',
                            border: '1px solid var(--border)',
                        }}>
                            {projects.map((project) => (
                                <div
                                    key={project.id}
                                    style={{
                                        background: 'var(--card)',
                                        padding: '28px 30px',
                                        cursor: 'pointer',
                                        transition: 'background 0.25s',
                                        position: 'relative',
                                    }}
                                    onClick={() => router.push(`/wizard?edit=${project.id}`)}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                        <div style={{
                                            width: '44px',
                                            height: '44px',
                                            background: 'rgba(201, 168, 76, 0.08)',
                                            border: '1px solid var(--gold-dk)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '18px',
                                        }}>{project.icon}</div>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            fontFamily: 'var(--font-mono)',
                                            fontSize: '10px',
                                            letterSpacing: '0.1em',
                                            textTransform: 'uppercase',
                                            color: project.status === 'live' ? '#52b788' : 'var(--muted)',
                                        }}>
                                            <div style={{
                                                width: '6px',
                                                height: '6px',
                                                borderRadius: '50%',
                                                background: project.status === 'live' ? '#52b788' : 'var(--muted)',
                                            }}></div>
                                            {project.status}
                                        </div>
                                    </div>

                                    <div style={{
                                        fontFamily: 'var(--font-display)',
                                        fontSize: '20px',
                                        fontWeight: '400',
                                        color: 'var(--white)',
                                        marginBottom: '4px',
                                    }}>{project.name}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '16px' }}>
                                        {project.business}
                                    </div>

                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
                                        <span style={{ padding: '3px 10px', border: '1px solid var(--border)', fontSize: '11px', color: 'var(--muted)' }}>
                                            {project.language}
                                        </span>
                                        <span style={{ padding: '3px 10px', border: '1px solid var(--border)', fontSize: '11px', color: 'var(--muted)' }}>
                                            {project.servicesCount} services
                                        </span>
                                        <span style={{ padding: '3px 10px', border: '1px solid var(--border)', fontSize: '11px', color: 'var(--muted)' }}>
                                            {project.schedule}
                                        </span>
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        paddingTop: '16px',
                                        borderTop: '1px solid var(--border)',
                                    }}>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{
                                                fontFamily: 'var(--font-display)',
                                                fontSize: '22px',
                                                color: 'var(--white)',
                                                fontWeight: '300',
                                            }}>{project.bookings}</div>
                                            <div style={{
                                                fontSize: '9px',
                                                letterSpacing: '0.12em',
                                                textTransform: 'uppercase',
                                                color: 'var(--muted)',
                                            }}>Bookings</div>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{
                                                fontFamily: 'var(--font-display)',
                                                fontSize: '22px',
                                                color: 'var(--white)',
                                                fontWeight: '300',
                                            }}>{project.calls}</div>
                                            <div style={{
                                                fontSize: '9px',
                                                letterSpacing: '0.12em',
                                                textTransform: 'uppercase',
                                                color: 'var(--muted)',
                                            }}>Calls</div>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{
                                                fontFamily: 'var(--font-display)',
                                                fontSize: '22px',
                                                color: 'var(--white)',
                                                fontWeight: '300',
                                            }}>{project.rate}</div>
                                            <div style={{
                                                fontSize: '9px',
                                                letterSpacing: '0.12em',
                                                textTransform: 'uppercase',
                                                color: 'var(--muted)',
                                            }}>Rate</div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* New Project Card */}
                            <div
                                onClick={() => setModalOpen(true)}
                                style={{
                                    background: 'var(--card)',
                                    border: '1px dashed var(--border)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '14px',
                                    padding: '48px 30px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    textAlign: 'center',
                                    minHeight: '220px',
                                }}
                            >
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    border: '1px solid var(--border)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '22px',
                                    color: 'var(--muted)',
                                }}>+</div>
                                <div>
                                    <span style={{
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: '11px',
                                        letterSpacing: '0.12em',
                                        textTransform: 'uppercase',
                                        color: 'var(--muted)',
                                    }}>New Agent</span>
                                    <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '6px' }}>
                                        Set up a new AI voice booking agent
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(8, 8, 8, 0.88)',
                        backdropFilter: 'blur(12px)',
                        zIndex: 200,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setModalOpen(false);
                    }}
                >
                    <div style={{
                        background: 'var(--card)',
                        border: '1px solid var(--border)',
                        width: '100%',
                        maxWidth: '520px',
                        padding: '48px',
                        position: 'relative',
                    }}>
                        <button
                            onClick={() => setModalOpen(false)}
                            style={{
                                position: 'absolute',
                                top: '18px',
                                right: '18px',
                                width: '32px',
                                height: '32px',
                                background: 'transparent',
                                border: '1px solid var(--border)',
                                color: 'var(--muted)',
                                fontSize: '14px',
                                cursor: 'pointer',
                            }}
                        >✕</button>

                        <div style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '10px',
                            letterSpacing: '0.18em',
                            textTransform: 'uppercase',
                            color: 'var(--gold)',
                            marginBottom: '14px',
                        }}>New Project</div>

                        <h2 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '36px',
                            fontWeight: '300',
                            color: 'var(--white)',
                            lineHeight: '1.1',
                            marginBottom: '8px',
                        }}>
                            Name your <em style={{ fontStyle: 'italic', color: 'var(--gold-lt)' }}>agent</em>
                        </h2>
                        <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '32px' }}>
                            Choose a name your customers will hear when they call.
                        </p>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{
                                display: 'block',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '10px',
                                letterSpacing: '0.16em',
                                textTransform: 'uppercase',
                                color: 'var(--gold-dk)',
                                marginBottom: '8px',
                            }}>Agent Name</label>
                            <input
                                type="text"
                                value={newAgentName}
                                onChange={(e) => setNewAgentName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && newAgentName.trim()) {
                                        handleCreateProject();
                                    }
                                }}
                                placeholder="e.g. Aria, Nova, James…"
                                maxLength={24}
                                autoFocus
                                style={{
                                    width: '100%',
                                    background: 'var(--surface)',
                                    border: '1px solid var(--border)',
                                    color: 'var(--white)',
                                    fontFamily: 'var(--font-body)',
                                    fontSize: '22px',
                                    fontWeight: '300',
                                    padding: '14px 18px',
                                    outline: 'none',
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={handleCreateProject}
                                disabled={!newAgentName.trim()}
                                style={{
                                    flex: 1,
                                    padding: '13px 24px',
                                    background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dk) 100%)',
                                    color: 'var(--black)',
                                    fontFamily: 'var(--font-body)',
                                    fontSize: '12px',
                                    fontWeight: '700',
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase',
                                    border: 'none',
                                    cursor: newAgentName.trim() ? 'pointer' : 'not-allowed',
                                    opacity: newAgentName.trim() ? 1 : 0.4,
                                }}
                            >
                                Continue
                            </button>
                            <button
                                onClick={() => setModalOpen(false)}
                                style={{
                                    padding: '13px 20px',
                                    background: 'transparent',
                                    border: '1px solid var(--border)',
                                    color: 'var(--muted)',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
