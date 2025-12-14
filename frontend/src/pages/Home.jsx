import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  UserCheck, 
  Users, 
  PackageCheck,
  Zap,
  ArrowRight,
  CheckCircle,
  Star,
  Sparkles,
  Award,
  BadgeCheck,
  TrendingUp,
  HeadphonesIcon,
  Briefcase
} from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <ShieldCheck className="h-8 w-8" />,
      title: "Approved Products",
      desc: "Technically verified items",
      color: "from-blue-500 to-cyan-500",
      highlight: "Quality Guaranteed"
    },
    {
      icon: <UserCheck className="h-8 w-8" />,
      title: "Verified Sellers",
      desc: "Trusted professionals only",
      color: "from-emerald-500 to-green-500",
      highlight: "100% Verified"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Expert Guidance",
      desc: "Technical team support",
      color: "from-purple-500 to-pink-500",
      highlight: "24/7 Support"
    },
    {
      icon: <Briefcase className="h-8 w-8" />,
      title: "Broker System",
      desc: "Coming soon",
      color: "from-amber-500 to-orange-500",
      highlight: "Launching 2024"
    }
  ];

  const stats = [
    { number: "10K+", label: "Approved Products", icon: <PackageCheck className="h-5 w-5" /> },
    { number: "2.5K+", label: "Verified Sellers", icon: <BadgeCheck className="h-5 w-5" /> },
    { number: "99%", label: "Satisfaction Rate", icon: <Star className="h-5 w-5" /> },
    { number: "24/7", label: "Expert Support", icon: <HeadphonesIcon className="h-5 w-5" /> }
  ];

  const upcomingFeatures = [
    { name: "Broker Marketplace", status: "Q2 2024", icon: <Briefcase className="h-5 w-5" /> },
    { name: "Service Technicians", status: "Q3 2024", icon: <Users className="h-5 w-5" /> },
    { name: "Enterprise Solutions", status: "Q4 2024", icon: <TrendingUp className="h-5 w-5" /> }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50" />
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <div className="text-center">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 mb-8">
              <Award className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-gray-700">Technically-Verified Marketplace</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Shop With
              <span className="block mt-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Expert Confidence
                </span>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              Verified products. Trusted sellers. Technical guidance. All in one place.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/products"
                className="group relative px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300"
              >
                <span className="relative flex items-center">
                  Explore Products
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link
                to="/register"
                className="px-8 py-4 rounded-xl font-semibold text-gray-700 bg-white border-2 border-gray-200 hover:border-blue-300 hover:bg-gray-50 transition-all"
              >
                Join Free Today
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
              <div className="flex justify-center mb-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-gray-50 to-white">
                  <div className="text-blue-600">{stat.icon}</div>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">{stat.number}</div>
              <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why We're Different
          </h2>
          <p className="text-gray-600 text-lg">
            Built on trust, backed by experts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative bg-white rounded-2xl p-8 border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-xl"
            >
              <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <div className="text-white">{feature.icon}</div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 mb-4">
                {feature.desc}
              </p>

              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                {feature.highlight}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust Process */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How Trust Works Here
            </h2>
            <p className="text-gray-600">
              Three steps to guaranteed satisfaction
            </p>
          </div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-emerald-500 to-purple-500 -z-10" />
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Product Verification",
                  desc: "Our technical team reviews every item",
                  checks: ["Quality Checked", "Specs Verified", "Performance Tested"]
                },
                {
                  step: "02",
                  title: "Seller Vetting",
                  desc: "Rigorous background and history check",
                  checks: ["Identity Verified", "Track Record", "Customer Reviews"]
                },
                {
                  step: "03",
                  title: "Expert Support",
                  desc: "Guidance through purchase and beyond",
                  checks: ["Pre-purchase Advice", "Installation Help", "Post-sale Support"]
                }
              ].map((step, index) => (
                <div key={index} className="text-center relative">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-2xl font-bold mb-6 mx-auto">
                    {step.step}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6">
                    {step.desc}
                  </p>
                  
                  <div className="space-y-2">
                    {step.checks.map((check, idx) => (
                      <div key={idx} className="flex items-center justify-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span className="text-gray-700">{check}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Future Vision */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-8">
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span className="text-sm font-medium text-white">Coming Soon</span>
          </div>
          
          <h2 className="text-4xl font-bold text-white mb-6">
            The Future of Smart Commerce
          </h2>
          
          <p className="text-gray-300 text-xl mb-10 max-w-2xl mx-auto">
            Professional brokers. Service technicians. Complete solutions.
          </p>

          {/* Upcoming Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {upcomingFeatures.map((feature, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="inline-flex p-3 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 mb-4">
                  <div className="text-amber-300">{feature.icon}</div>
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">{feature.name}</h4>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/10 text-white">
                  {feature.status}
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/early-access"
            className="inline-flex items-center px-8 py-4 rounded-xl font-semibold text-gray-900 bg-white hover:bg-gray-100 transition-all"
          >
            Get Early Access
            <ArrowRight className="ml-3 h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Final CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Ready to Shop Smarter?
            </h2>
            
            <p className="text-gray-600 text-lg mb-10 max-w-xl mx-auto">
              Join thousands who trust our platform for verified products and expert guidance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl transition-all"
              >
                Start Free Account
              </Link>
              
              <Link
                to="/demo"
                className="px-8 py-4 rounded-xl font-semibold text-gray-700 bg-white border-2 border-gray-200 hover:border-blue-300"
              >
                Book a Demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;