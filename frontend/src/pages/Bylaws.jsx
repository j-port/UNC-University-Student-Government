import { motion } from 'framer-motion'
import PageHeader from '../components/PageHeader'
import { ArrowLeft, Download, Gavel } from 'lucide-react'
import { Link } from 'react-router-dom'

const bylaws = [
  {
    number: '1',
    title: 'Meetings and Quorum',
    sections: [
      'The Student Council shall hold regular meetings every two weeks during the academic year.',
      'A majority of all members shall constitute a quorum for the transaction of business.',
      'Special meetings may be called by the President or upon written request of one-third of the Council members.',
    ],
  },
  {
    number: '2',
    title: 'Order of Business',
    sections: [
      'Call to Order and Roll Call',
      'Reading and Approval of Minutes',
      'Reports from Officers and Committees',
      'Old Business',
      'New Business',
      'Announcements',
      'Adjournment',
    ],
  },
  {
    number: '3',
    title: 'Committees',
    sections: [
      'Standing committees shall include: Finance, Academic Affairs, Student Welfare, Events, and Communications.',
      'Ad hoc committees may be created by resolution of the Council.',
      'Committee chairs shall be appointed by the President with confirmation by the Council.',
    ],
  },
  {
    number: '4',
    title: 'Financial Procedures',
    sections: [
      'All expenditures shall require approval from the Finance Committee.',
      'Monthly financial reports shall be submitted to the Council and published for transparency.',
      'An annual audit shall be conducted at the end of each academic year.',
    ],
  },
  {
    number: '5',
    title: 'Election Procedures',
    sections: [
      'Elections shall be conducted by the Commission on Elections (COMELEC).',
      'Candidates must file their certificates of candidacy at least two weeks before the election.',
      'Campaign period shall be limited to one week before the election date.',
    ],
  },
  {
    number: '6',
    title: 'Impeachment',
    sections: [
      'Any officer may be impeached for culpable violation of the Constitution, misconduct, or betrayal of public trust.',
      'Impeachment proceedings shall be initiated by a complaint filed with the Student Tribunal.',
      'A two-thirds vote of all Council members shall be required for conviction.',
    ],
  },
  {
    number: '7',
    title: 'Amendments to By-Laws',
    sections: [
      'Amendments may be proposed by any Council member.',
      'Proposed amendments must be submitted in writing at least one meeting before voting.',
      'A two-thirds vote of all members present shall be required for adoption.',
    ],
  },
]

export default function Bylaws() {
  return (
    <main>
      <PageHeader
        badge="Governance Document"
        title="USG By-Laws"
        subtitle="Detailed rules and regulations governing the operations of the University Student Government"
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
              <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Gavel className="w-10 h-10 text-white" />
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-school-grey-800 mb-2">
                By-Laws of the University Student Government
              </h1>
              <p className="text-school-grey-500">
                Last Amended: September 2024
              </p>
            </div>

            {/* By-Laws Content */}
            <div className="space-y-10">
              {bylaws.map((bylaw, index) => (
                <motion.div
                  key={bylaw.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-school-grey-50 rounded-xl p-6"
                >
                  <h2 className="font-display text-lg font-semibold text-school-grey-800 mb-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-university-red text-white rounded-lg text-sm mr-3">
                      {bylaw.number}
                    </span>
                    {bylaw.title}
                  </h2>
                  <ul className="space-y-3 ml-11">
                    {bylaw.sections.map((section, sIndex) => (
                      <li key={sIndex} className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-university-red rounded-full mt-2 mr-3 flex-shrink-0" />
                        <span className="text-school-grey-700">{section}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-school-grey-200 text-center">
              <p className="text-school-grey-500 text-sm">
                These By-Laws were adopted by the Student Council and shall be 
                interpreted in accordance with the USG Constitution.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
