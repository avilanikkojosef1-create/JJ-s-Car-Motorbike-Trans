import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  createdAt: any;
  slug: string;
}

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(
          collection(db, 'posts'),
          where('published', '==', true),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Post[];
        setPosts(data);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'posts');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <div className="p-24 text-center">Opening the journal...</div>;

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-slate-50 py-32 px-8 overflow-hidden relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs uppercase tracking-[0.4em] text-primary font-bold mb-4"
          >
            Insights & Guides
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-bold tracking-tighter text-on-surface mb-8 max-w-4xl leading-[0.9]"
          >
            Travel <span className="text-primary italic">Better</span>, <br />Explore Further.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-on-surface-variant max-w-2xl font-medium leading-relaxed"
          >
            From island hopping guides to local food recommendations, our blog covers everything you need to know about navigating Leyte with confidence.
          </motion.p>
        </div>
        <div className="absolute right-[-10%] top-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]"></div>
      </section>

      {/* Post Grid */}
      <section className="py-24 px-8 max-w-7xl mx-auto w-full">
        {posts.length === 0 ? (
          <div className="text-center py-24 glass-card">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6 text-on-surface-variant">
              <BookOpen size={32} />
            </div>
            <h3 className="text-xl font-bold text-on-surface mb-2">No Stories Yet</h3>
            <p className="text-on-surface-variant">Check back soon for new travel updates.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {posts.map((post, i) => (
              <motion.article 
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col group"
              >
                <Link to={`/blog/${post.slug}`} className="block aspect-[16/10] rounded-3xl overflow-hidden mb-6 relative">
                  <img 
                    src={post.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop'} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </Link>
                
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                    <span className="flex items-center gap-1.5"><Calendar size={12} className="text-primary" /> {post.createdAt?.toDate().toLocaleDateString()}</span>
                    <span className="flex items-center gap-1.5"><User size={12} className="text-primary" /> {post.author}</span>
                  </div>
                  
                  <Link to={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                    <h2 className="text-3xl font-bold tracking-tight text-on-surface leading-tight">{post.title}</h2>
                  </Link>
                  
                  <p className="text-on-surface-variant font-medium leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <Link 
                    to={`/blog/${post.slug}`}
                    className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-primary group/link mt-2"
                  >
                    Read Full Story
                    <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
