import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Briefcase, Lightbulb, Rocket, CheckCircle2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            {/* Navbar */}
            <nav className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img src="/LOGO PR LEARNING.png" alt="Profenger Learning" className="h-8 w-auto object-contain" />
                    </div>
                    {/* <div className="flex items-center gap-4">
                        <Link to="/prompt-contest">
                            <Button variant="ghost" className="font-medium text-primary hidden sm:flex">
                                AI Prompt Contest
                            </Button>
                        </Link>
                        <Link to="/feedback">
                            <Button variant="ghost" className="font-medium">
                                Log In <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                    </div> */}
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-12 pb-10  lg:pt-20 lg:pb-32">
                <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Side - Image */}
                        <div className="relative order-1 flex justify-center py-8">
                            <img
                                src="/awareness.png"
                                alt="Career Awareness Session"
                                className="w-full h-auto max-w-md lg:max-w-full object-contain mix-blend-multiply drop-shadow-2xl"
                            />
                            {/* Decorative blob */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/20 blur-[100px] -z-10 rounded-full"></div>
                        </div>

                        {/* Right Side - Content */}
                        <div className="text-left order-2 flex flex-col justify-center items-start">
                            {/* <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-6 backdrop-blur-sm">
                                <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                                CAREER AWARENESS SESSION
                            </div> */}

                            {/* <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6 leading-[1.15]">
                                Behind <br className="hidden sm:block" />
                                <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-light">
                                    Every App
                                </span>
                            </h1> */}

                            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
                                Explore the exciting opportunities in web development. Join us to understand what powers the digital world and how you can be a part of it.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                                <Link to="/prompt-contest" className="w-full sm:w-auto">
                                    <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full w-full sm:w-auto border-primary/50 hover:bg-primary/5">
                                        <Sparkles className="mr-2 w-5 h-5 text-primary" /> AI Prompt Contest
                                    </Button>
                                </Link>
                                <Link to="/feedback" className="w-full sm:w-auto">
                                    <Button size="lg" className="h-14 px-8 text-lg shadow-lg shadow-primary/25 rounded-full hover:scale-105 transition-transform w-full sm:w-auto">
                                        Give Feedback <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Session Details */}
            < section className="" >
                <div className="max-w-5xl mx-auto px-4">
                    <div className="bg-primary rounded-3xl p-6 md:p-12 overflow-hidden relative shadow-xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-16">
                            <div className="flex-1 text-left w-full">
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Session Details</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 text-white/90 justify-start">
                                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs text-white/60 uppercase tracking-wider font-semibold">Date</p>
                                            <p className="font-medium">18 / 02 / 2026</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-white/90 justify-start">
                                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs text-white/60 uppercase tracking-wider font-semibold">Time</p>
                                            <p className="font-medium">02:30 PM</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-white/90 justify-start">
                                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs text-white/60 uppercase tracking-wider font-semibold">Location</p>
                                            <p className="font-medium">NSS College Manjeri</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 w-full max-w-sm">
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 w-full">
                                    <h3 className="text-white font-semibold mb-4 flex items-center justify-center md:justify-start">
                                        <Rocket className="w-5 h-5 mr-2" />
                                        Hosted By
                                    </h3>
                                    <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                                        <img src="/LOGO PR LEARNING.png" alt="Profenger" className="h-10 sm:h-12 w-auto object-contain bg-white rounded-lg p-1 shrink-0" />
                                        <div>
                                            <p className="text-white font-bold">Profenger Learning</p>
                                            <p className="text-white/70 text-sm">Empowering Future Tech</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >
            {/* Features Grid */}
            <section className="py-24 bg-secondary/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold tracking-tight mb-4">What We Covered</h2>
                        <p className="text-muted-foreground text-lg">
                            Key takeaways from our session on the future of web development.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: BookOpen,
                                title: "Web Development",
                                description: "Understanding the core concepts and architecture behind modern web applications.",
                                color: "text-blue-500",
                                bg: "bg-blue-500/10"
                            },
                            {
                                icon: Briefcase,
                                title: "Career Paths",
                                description: "Exploring diverse opportunities and growth potential in the tech industry.",
                                color: "text-violet-500",
                                bg: "bg-violet-500/10"
                            },
                            {
                                icon: Lightbulb,
                                title: "Essential Skills",
                                description: "Identifying the technical and soft skills needed to succeed as a developer.",
                                color: "text-amber-500",
                                bg: "bg-amber-500/10"
                            },
                            {
                                icon: Rocket,
                                title: "Getting Started",
                                description: "Practical steps and resources to begin your journey in coding today.",
                                color: "text-emerald-500",
                                bg: "bg-emerald-500/10"
                            }
                        ].map((feature, i) => (
                            <div key={i} className="group p-8 bg-card rounded-2xl border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300">
                                <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section >



            <footer className="bg-card border-t pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 mb-12">
                        {/* Profenger Learning */}
                        <div className="space-y-4 text-center md:text-left">
                            <h3 className="text-lg font-semibold text-primary">Profenger Learning</h3>
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <p className="flex items-center justify-center md:justify-start gap-2">
                                    <span>📧</span> <a href="mailto:info@learning.profenger.com" className="hover:text-primary transition-colors">info@learning.profenger.com</a>
                                </p>
                                <p className="flex items-center justify-center md:justify-start gap-2">
                                    <span>📞</span> <a href="tel:+919633224411" className="hover:text-primary transition-colors">+91 96 3322 4411</a>
                                </p>
                                <p className="flex items-center justify-center md:justify-start gap-2">
                                    <span>🌐</span> <a href="https://learning.profenger.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">learning.profenger.com</a>
                                </p>
                                <p className="flex items-center justify-center md:justify-start gap-2">
                                    <span>📸</span> <a href="https://www.instagram.com/profengerlearn" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">@profengerlearn</a>
                                </p>
                            </div>
                        </div>

                        {/* Xteum */}
                        <div className="space-y-4 text-center md:text-right">
                            <h3 className="text-lg font-semibold text-primary">Xteum (Parent Company)</h3>
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <p className="flex items-center justify-center md:justify-end gap-2">
                                    <a href="mailto:info@xteum.com" className="hover:text-primary transition-colors">info@xteum.com</a> <span>📧</span>
                                </p>
                                <p className="flex items-center justify-center md:justify-end gap-2">
                                    <a href="tel:+919020042004" className="hover:text-primary transition-colors">+91 90 2004 2004</a> <span>📞</span>
                                </p>
                                <p className="flex items-center justify-center md:justify-end gap-2">
                                    <a href="https://www.xteum.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">www.xteum.com</a> <span>🌐</span>
                                </p>
                                <p className="flex items-center justify-center md:justify-end gap-2">
                                    <a href="https://www.instagram.com/xteumtech?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">@xteumtech</a> <span>📸</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center text-center border-t border-border pt-8">
                        <img src="/Social-Media-Logo2.png" alt="Profenger Learning" className="h-12 w-auto mb-6 opacity-80" />
                        <p className="text-muted-foreground text-sm">
                            © {new Date().getFullYear()} Profenger Learning. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div >
    );
};

export default Landing;
