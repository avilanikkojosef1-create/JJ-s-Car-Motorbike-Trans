import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import ReactMarkdown from 'react-markdown';
import { motion } from 'motion/react';
import { Calendar, User, ChevronLeft, Share2 } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  content: string;
  image: string;
  author: string;
  createdAt: any;
  slug: string;
}

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const q = query(
          collection(db, 'posts'),
          where('slug', '==', slug),
          limit(1)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          setPost({ id: doc.id, ...doc.data() } as Post);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `posts/${slug}`);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) return <div className="p-24 text-center">Translating story...</div>;
  if (!post) return <div className="p-24 text-center">Post not found.</div>;

  return (
    <article className="flex flex-col pb-32">
      {/* Header */}
      <header className="relative py-32 px-8 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 opacity-40">
          <img src={post.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop'} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900"></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <Link to="/blog" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary mb-12 hover:text-white transition-colors">
            <ChevronLeft size={16} /> Back to Journal
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/50 mb-6">
              <span className="flex items-center gap-2 text-primary"><Calendar size={14} /> {post.createdAt?.toDate().toLocaleDateString()}</span>
              <span className="flex items-center gap-2"><User size={14} /> {post.author}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-8">
              {post.title}
            </h1>
          </motion.div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-3xl mx-auto w-full px-8 -mt-20 relative z-20">
        <div className="bg-white rounded-[2rem] p-12 md:p-20 shadow-2xl border border-slate-100">
          <div className="markdown-body">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
          
          <div className="mt-20 pt-10 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-on-surface">
                 <User size={20} />
               </div>
               <div>
                  <p className="text-xs font-black uppercase tracking-widest text-on-surface">{post.author}</p>
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Official Contributor</p>
               </div>
            </div>
            <button className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-on-surface hover:bg-primary hover:text-white hover:border-primary transition-all">
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
