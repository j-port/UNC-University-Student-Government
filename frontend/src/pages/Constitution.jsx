import { motion } from 'framer-motion'
import PageHeader from '../components/PageHeader'
import { ArrowLeft, Download, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'

const articles = [
  {
    number: 'I',
    title: 'Name and Domicile',
    content: 'This organization shall be known as the University Student Government (USG), hereinafter referred to as the "Government." The seat of the Government shall be at the Student Center Building of the University.',
  },
  {
    number: 'II',
    title: 'Declaration of Principles',
    content: 'The USG recognizes that sovereignty resides in the students and all government authority emanates from them. The USG shall serve and protect the rights, welfare, and interests of the students.',
  },
  {
    number: 'III',
    title: 'Membership',
    content: 'All bona fide students of the University who are currently enrolled and have paid their student government fees shall automatically become members of the USG.',
  },
  {
    number: 'IV',
    title: 'Structure of Government',
    content: 'The USG shall be composed of the Executive Branch, headed by the President; the Legislative Branch, composed of the Student Council; and the Judicial Branch, composed of the Student Tribunal.',
  },
  {
    number: 'V',
    title: 'The Executive Branch',
    content: 'The Executive power shall be vested in the President of the USG. The President shall be assisted by the Vice President, Executive Secretary, and other appointed officers.',
  },
  {
    number: 'VI',
    title: 'The Legislative Branch',
    content: 'The Legislative power shall be vested in the Student Council, composed of elected representatives from each college. The Council shall have the power to enact resolutions, ordinances, and appropriations.',
  },
  {
    number: 'VII',
    title: 'The Judicial Branch',
    content: 'The Judicial power shall be vested in the Student Tribunal. The Tribunal shall have jurisdiction over all cases involving the interpretation of this Constitution and the By-Laws.',
  },
  {
    number: 'VIII',
    title: 'Elections',
    content: 'The USG shall hold general elections annually during the second semester. All officers shall be elected by direct vote of the student body through a secret ballot system.',
  },
  {
    number: 'IX',
    title: 'Amendments',
    content: 'Amendments to this Constitution may be proposed by a two-thirds vote of all members of the Student Council or by petition of at least ten percent of the student body.',
  },
]

export default function Constitution() {
  return (
    <main>
      <PageHeader
        badge="Governance Document"
        title="USG Constitution"
        subtitle="The fundamental law that establishes and governs the University Student Government"
      />

      <section className="bg-school-grey-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Navigation & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <Link 
              to="/governance"
              className="inline-flex items-center text-school-grey-600 hover:text-university-red transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Governance Hub
            </Link>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary inline-flex items-center"
            >
              <Download className="w-5 h-5 mr-2" />
              Download PDF
            </motion.button>
          </div>

          {/* Document */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-card p-8 md:p-12"
          >
            {/* Header */}
            <div className="text-center mb-12 pb-8 border-b border-school-grey-200">
              <div className="w-20 h-20 bg-university-red rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-school-grey-800 mb-2">
                Constitution of the University Student Government
              </h1>
              <p className="text-school-grey-500">
                Ratified: Academic Year 2023-2024
              </p>
            </div>

            {/* Preamble */}
            <div className="mb-12">
              <h2 className="font-display text-xl font-semibold text-university-red mb-4">
                PREAMBLE
              </h2>
              <p className="text-school-grey-700 leading-relaxed italic">
                We, the students of the University, imploring the aid of Divine Providence, 
                in order to establish a student government that shall embody our ideals and aspirations, 
                promote the general welfare, advance academic excellence, and secure to ourselves 
                and our successors the blessings of a democratic institution, do ordain and promulgate 
                this Constitution.
              </p>
            </div>

            {/* Articles */}
            <div className="space-y-10">
              {articles.map((article, index) => (
                <motion.div
                  key={article.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <h2 className="font-display text-lg font-semibold text-school-grey-800 mb-3">
                    <span className="text-university-red">ARTICLE {article.number}:</span>{' '}
                    {article.title}
                  </h2>
                  <p className="text-school-grey-700 leading-relaxed pl-4 border-l-2 border-university-red-200">
                    {article.content}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-school-grey-200 text-center">
              <p className="text-school-grey-500 text-sm">
                This Constitution was ratified by a majority vote of the student body 
                and shall take effect immediately upon its ratification.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
