import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const faqs = [
    {
        question: "How do I register for events?",
        answer: "You can register for events by clicking the 'Register Now' button on the navigation bar. You'll need to sign in with your Official college mail ID and fill in your details.",
    },
    {
        question: "Is there a registration fee?",
        answer: "No, there are no registration fees. All events are completely free to participate in.",
    },
    {
        question: "Can I participate in multiple events?",
        answer: "Yes! You can participate in as many events as you like, provided their schedules don't clash. Please check the Timeline page to plan your day.",
    },
    {
        question: "Who can participate in Thiran 2026?",
        answer: "Thiran is an intra-college function. Only students of our college can participate in the events.",
    },
    {
        question: "What is the team size for Hack-The-Box?",
        answer: "For Hack-The-Box, you need a team of exactly 2 members.",
    },
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section id="faq" className="section-padding relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cosmic-purple/10 via-background to-background -z-10" />

            <div className="container mx-auto max-w-4xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
                        <HelpCircle className="w-4 h-4 text-cosmic-cyan" />
                        <span className="text-sm font-medium text-cosmic-cyan">FREQUENTLY ASKED QUESTIONS</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Got <span className="gradient-text">Questions?</span>
                    </h2>
                    <p className="text-muted-foreground">
                        Everything you need to know about Thiran 2026.
                    </p>
                </motion.div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-strong rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-colors"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-6 text-left group"
                            >
                                <span className={`font-semibold text-lg transition-colors ${openIndex === index ? 'text-cosmic-cyan' : 'text-foreground'}`}>
                                    {faq.question}
                                </span>
                                <div className={`p-2 rounded-full glass transition-all duration-300 ${openIndex === index ? 'bg-cosmic-cyan/20 rotate-180' : 'group-hover:bg-white/10'}`}>
                                    {openIndex === index ? (
                                        <Minus className="w-4 h-4 text-cosmic-cyan" />
                                    ) : (
                                        <Plus className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                                    )}
                                </div>
                            </button>

                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    >
                                        <div className="px-6 pb-6 pt-0 text-muted-foreground leading-relaxed border-t border-white/5 mx-6 mt-2 pt-4">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
