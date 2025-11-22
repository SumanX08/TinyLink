import Header from '../Components/Header'
import LinkForm from '../Components/LinkForm'
import LinkTable from '../Components/LinkTable'

const Dashboard = () => {
  return (
    <div className='min-h-screen'>
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <LinkForm />
          <LinkTable />
        </div>
      </div>

    </div>
  )
}

export default Dashboard