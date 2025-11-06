"use client"

import { motion } from "framer-motion"
import Navigation from "@/components/Navigation"
import { Mail, Phone } from "lucide-react"

const coordinators = [
  {
    name: "Dr. Godfrey Winster S",
    role: "SPOC",
    email: "godfreys@srmist.edu.in",
    phone: "+91 9962594141"
  },
  {
    name: "Dr. K. Vijaya",
    role: "Coordinator",
    email: "vijayak@srmist.edu.in",
    phone: "+91 9444146212"
  },
  {
    name: "Dr. M. Baskar",
    role: "Program Schedule Inauguration Valedictory",
    email: "baskarm1@srmist.edu.in",
    phone: "+91 8248485987"
  },
  {
    name: "Dr. N. Arunachalam",
    role: "Finance, Sponsor, Purchase",
    email: "arunachn@srmist.edu.in",
    phone: "+91 9944342292"
  },
  {
    name: "Dr. J. Selvin Paul Peter",
    role: "Guest Hospitality and Logistics",
    email: "selvinpj@srmist.edu.in",
    phone: "+91 9986563360"
  },
  {
    name: "Dr. K. Kishore Anthuvan Sahayaraj",
    role: "Students Hospitality",
    email: "kishorea1@srmist.edu.in",
    phone: "+91 9043103219"
  },
  {
    name: "Dr. S. Gnanavel",
    role: "Co-Coordinator, Hall arrangement and venue coordination",
    email: "gnanaves1@srmist.edu.in",
    phone: "+91 9976985204"
  },
  {
    name: "Dr. M. Sindhuja",
    role: "Design of Brochure, Publicity, All campus advertising Board, Certificate and Printing",
    email: "sindhujm1@srmist.edu.in",
    phone: "+91 9840297677"
  },
  {
    name: "Dr. S. S. Saranya",
    role: "Report preparation, Photography, IEEE events video for Inaugural function, video for valedictory",
    email: "saranyas6@srmist.edu.in",
    phone: "+91 7904942221"
  },
  {
    name: "Dr. V. Arulalan",
    role: "Program Schedule Inauguration Valedictory",
    email: "arulalav@srmist.edu.in",
    phone: "+91 8015648194"
  },
  {
    name: "Dr. T. Ragunthar",
    role: "Guest Memento, participants kit purchase",
    email: "raguntht@srmist.edu.in",
    phone: "+91 9600191718"
  },
  {
    name: "Dr. C. Muralidharan",
    role: "Website Design, Development and Updating at regular interval",
    email: "muralidc@srmist.edu.in",
    phone: "+91 9585579526"
  },
  {
    name: "Dr. G. Balamurugan",
    role: "Guest Coordination",
    email: "balamurg1@srmist.edu.in",
    phone: "+91 9629308990"
  },
  {
    name: "Dr. K. Vijiyakumar",
    role: "Website Design, Development and Updating at regular interval",
    email: "vijiyakk@srmist.edu.in",
    phone: "+91 9994472250"
  },
  {
    name: "Dr. D. Gokulakrishnan",
    role: "Guest Hospitality and Logistics",
    email: "gokulakd@srmist.edu.in",
    phone: "+91 9629879934"
  },
  {
    name: "Dr. Ramkumar Jayaraman",
    role: "Participants Registration and accommodation",
    email: "ramkumaj@srmist.edu.in",
    phone: "+91 9894425770"
  }
]

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4 mb-16"
        >
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight">CONTACT</h1>
          <p className="text-xl text-muted-foreground font-serif max-w-2xl">
            Reach our faculty coordinators for HIZE 2026.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coordinators.map((coordinator, index) => (
            <motion.div
              key={coordinator.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="clay-card p-8 space-y-6 bg-gradient-to-br from-card via-secondary to-accent"
            >
              <div>
                <h3 className="text-2xl font-bold mb-2">{coordinator.name}</h3>
                <p className="text-muted-foreground font-serif">{coordinator.role}</p>
              </div>

              <div className="space-y-4 pt-4 border-t border-border">
                <motion.a
                  href={`mailto:${coordinator.email}`}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 clay-button bg-secondary hover:bg-accent p-4 rounded-xl group transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-mono break-all">{coordinator.email}</span>
                </motion.a>

                <motion.a
                  href={`tel:${coordinator.phone.replace(/\s/g, '')}`}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 clay-button bg-secondary hover:bg-accent p-4 rounded-xl group transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-mono">{coordinator.phone}</span>
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <footer className="border-t border-border mt-20 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>© 2026 IEEE CS SRM | In collaboration with SRM Institute of Science & Technology</p>
        </div>
      </footer>
    </div>
  )
}