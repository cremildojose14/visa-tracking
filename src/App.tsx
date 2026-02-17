import { useState, useEffect } from 'react';
import { Passenger, Alert } from './types';
import { 
  FiUser, FiClock, FiAlertCircle, 
  FiCheckCircle, FiAlertTriangle, FiGlobe, 
  FiMail, FiPhone, FiEdit, FiSend, FiBell,
  FiSearch, FiPlus, FiRefreshCw, FiInfo
} from 'react-icons/fi';
import { HiOutlineExclamationCircle, HiOutlineCheckCircle } from 'react-icons/hi';

// Mock data for demonstration
const mockPassengers: Passenger[] = [
  {
    id: '1',
    name: 'Carlos Silva',
    passportNumber: 'AB123456',
    nationality: 'Brasil',
    visaType: 'Turista',
    entryDate: new Date('2025-01-15'),
    visaDurationDays: 90,
    daysRemaining: 15,
    status: 'expiring',
    email: 'carlos@email.com',
    phone: '+55 11 98765-4321',
    alerts: [
      { id: 'a1', passengerId: '1', type: 'warning', message: 'Visto expira em 15 dias', date: new Date('2025-04-10'), read: false },
      { id: 'a2', passengerId: '1', type: 'info', message: 'Extensão solicitada', date: new Date('2025-03-20'), read: true }
    ]
  },
  {
    id: '2',
    name: 'Maria Garcia',
    passportNumber: 'CD789012',
    nationality: 'Espanha',
    visaType: 'Estudante',
    entryDate: new Date('2025-02-01'),
    visaDurationDays: 180,
    daysRemaining: 45,
    status: 'valid',
    email: 'maria@email.com',
    phone: '+34 600 123 456',
    alerts: [
      { id: 'a3', passengerId: '2', type: 'info', message: 'Documentação completa', date: new Date('2025-02-05'), read: true }
    ]
  },
  {
    id: '3',
    name: 'John Smith',
    passportNumber: 'EF345678',
    nationality: 'Estados Unidos',
    visaType: 'Negócios',
    entryDate: new Date('2025-01-10'),
    visaDurationDays: 30,
    daysRemaining: -5,
    status: 'expired',
    email: 'john@email.com',
    phone: '+1 202 555 0187',
    alerts: [
      { id: 'a4', passengerId: '3', type: 'danger', message: 'Visto expirado há 5 dias', date: new Date('2025-04-05'), read: false }
    ]
  },
  {
    id: '4',
    name: 'Anna Müller',
    passportNumber: 'GH901234',
    nationality: 'Alemanha',
    visaType: 'Trabalho',
    entryDate: new Date('2025-03-01'),
    visaDurationDays: 365,
    daysRemaining: 320,
    status: 'valid',
    email: 'anna@email.com',
    phone: '+49 151 12345678',
    alerts: []
  },
  {
    id: '5',
    name: 'Kenji Tanaka',
    passportNumber: 'IJ567890',
    nationality: 'Japão',
    visaType: 'Turista',
    entryDate: new Date('2025-03-15'),
    visaDurationDays: 90,
    daysRemaining: 60,
    status: 'valid',
    email: 'kenji@email.com',
    phone: '+81 90 1234 5678',
    alerts: []
  },
  {
    id: '6',
    name: 'Sophie Martin',
    passportNumber: 'KL123456',
    nationality: 'França',
    visaType: 'Estudante',
    entryDate: new Date('2025-02-20'),
    visaDurationDays: 120,
    daysRemaining: 25,
    status: 'expiring',
    email: 'sophie@email.com',
    phone: '+33 6 12 34 56 78',
    alerts: [
      { id: 'a5', passengerId: '6', type: 'warning', message: 'Visto expira em 25 dias', date: new Date('2025-04-01'), read: false }
    ]
  }
];

function App() {
  const [passengers, setPassengers] = useState<Passenger[]>(mockPassengers);
  const [selectedPassenger, setSelectedPassenger] = useState<Passenger | null>(mockPassengers[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [extensionDays, setExtensionDays] = useState<string>('30');
  const [extensionReason, setExtensionReason] = useState<string>('');
  const [unreadAlerts, setUnreadAlerts] = useState<Alert[]>([]);

  // Calculate statistics
  const stats = {
    total: passengers.length,
    valid: passengers.filter(p => p.status === 'valid').length,
    expiring: passengers.filter(p => p.status === 'expiring').length,
    expired: passengers.filter(p => p.status === 'expired').length,
    extended: passengers.filter(p => p.status === 'extended').length,
    totalAlerts: passengers.reduce((acc, p) => acc + p.alerts.length, 0),
    unreadAlertsCount: passengers.reduce((acc, p) => acc + p.alerts.filter(a => !a.read).length, 0)
  };

  // Filter passengers based on search and filter
  const filteredPassengers = passengers.filter(passenger => {
    const matchesSearch = passenger.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      passenger.passportNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      passenger.nationality.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || passenger.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // Update days remaining periodically (simulate time passing)
  useEffect(() => {
    const interval = setInterval(() => {
      setPassengers(prev => prev.map(p => {
        // Simulate decreasing days remaining
        const newDaysRemaining = Math.max(-10, p.daysRemaining - 0.1);
        let newStatus = p.status;
        
        if (newDaysRemaining <= 0 && newDaysRemaining > -30) {
          newStatus = 'expired';
        } else if (newDaysRemaining <= 30 && newDaysRemaining > 0) {
          newStatus = 'expiring';
        } else if (newDaysRemaining > 30) {
          newStatus = 'valid';
        }
        
        // Generate alerts for expiring visas
        const newAlerts = [...p.alerts];
        if (newDaysRemaining === 30 && !p.alerts.some(a => a.message.includes('expira em 30 dias'))) {
          newAlerts.push({
            id: `alert-${Date.now()}`,
            passengerId: p.id,
            type: 'warning',
            message: `Visto expira em 30 dias`,
            date: new Date(),
            read: false
          });
        }
        
        if (newDaysRemaining === 7 && !p.alerts.some(a => a.message.includes('expira em 7 dias'))) {
          newAlerts.push({
            id: `alert-${Date.now()}-7`,
            passengerId: p.id,
            type: 'danger',
            message: `Visto expira em 7 dias!`,
            date: new Date(),
            read: false
          });
        }
        
        return {
          ...p,
          daysRemaining: Math.round(newDaysRemaining),
          status: newStatus,
          alerts: newAlerts
        };
      }));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Update unread alerts
  useEffect(() => {
    const allAlerts: Alert[] = [];
    passengers.forEach(p => {
      p.alerts.forEach(a => {
        if (!a.read) allAlerts.push(a);
      });
    });
    setUnreadAlerts(allAlerts);
  }, [passengers]);

  const handleExtendVisa = () => {
    if (!selectedPassenger || !extensionDays || !extensionReason) return;
    
    const days = parseInt(extensionDays);
    if (isNaN(days) || days <= 0) return;
    
    setPassengers(prev => prev.map(p => {
      if (p.id === selectedPassenger.id) {
        const newDaysRemaining = p.daysRemaining + days;
        const newStatus = newDaysRemaining > 30 ? 'valid' : 'expiring';
        
        const newAlert: Alert = {
          id: `ext-${Date.now()}`,
          passengerId: p.id,
          type: 'success',
          message: `Visto estendido por ${days} dias. Motivo: ${extensionReason}`,
          date: new Date(),
          read: false
        };
        
        return {
          ...p,
          daysRemaining: newDaysRemaining,
          status: newStatus,
          alerts: [...p.alerts, newAlert],
          visaDurationDays: p.visaDurationDays + days
        };
      }
      return p;
    }));
    
    // Update selected passenger
    setSelectedPassenger(prev => {
      if (!prev) return null;
      const updated = passengers.find(p => p.id === prev.id);
      return updated || null;
    });
    
    // Reset form
    setExtensionReason('');
    setExtensionDays('30');
    
    // Show success message
    alert(`Visto de ${selectedPassenger.name} estendido com sucesso por ${days} dias.`);
  };

  const handleSendAlert = (passenger: Passenger, alertMessage: string) => {
    const newAlert: Alert = {
      id: `send-${Date.now()}`,
      passengerId: passenger.id,
      type: 'info',
      message: `Alerta enviado: ${alertMessage}`,
      date: new Date(),
      read: false
    };
    
    setPassengers(prev => prev.map(p => {
      if (p.id === passenger.id) {
        return { ...p, alerts: [...p.alerts, newAlert] };
      }
      return p;
    }));
    
    alert(`Alerta enviado para ${passenger.name}: ${alertMessage}`);
  };

  const handleMarkAlertAsRead = (alertId: string) => {
    setPassengers(prev => prev.map(p => ({
      ...p,
      alerts: p.alerts.map(a => a.id === alertId ? { ...a, read: true } : a)
    })));
  };

  const handleMarkAllAlertsAsRead = () => {
    setPassengers(prev => prev.map(p => ({
      ...p,
      alerts: p.alerts.map(a => ({ ...a, read: true }))
    })));
  };

  const handleAddNewPassenger = () => {
    const newPassenger: Passenger = {
      id: `p${Date.now()}`,
      name: `Novo Passageiro ${passengers.length + 1}`,
      passportNumber: `XX${Math.floor(Math.random() * 1000000)}`,
      nationality: 'A definir',
      visaType: 'Turista',
      entryDate: new Date(),
      visaDurationDays: 90,
      daysRemaining: 90,
      status: 'valid',
      email: 'email@exemplo.com',
      phone: '+00 000 000 000',
      alerts: []
    };
    
    setPassengers(prev => [...prev, newPassenger]);
    setSelectedPassenger(newPassenger);
    alert('Novo passageiro adicionado. Por favor, edite as informações.');
  };

  const getStatusColor = (status: Passenger['status']) => {
    switch(status) {
      case 'valid': return 'bg-green-100 text-green-800';
      case 'expiring': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'extended': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Passenger['status']) => {
    switch(status) {
      case 'valid': return <HiOutlineCheckCircle className="text-green-500" />;
      case 'expiring': return <HiOutlineExclamationCircle className="text-yellow-500" />;
      case 'expired': return <FiAlertCircle className="text-red-500" />;
      case 'extended': return <FiCheckCircle className="text-blue-500" />;
      default: return <FiClock className="text-gray-500" />;
    }
  };

  const getAlertColor = (type: Alert['type']) => {
    switch(type) {
      case 'warning': return 'border-l-yellow-500 bg-yellow-50';
      case 'danger': return 'border-l-red-500 bg-red-50';
      case 'info': return 'border-l-blue-500 bg-blue-50';
      case 'success': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch(type) {
      case 'warning': return <FiAlertTriangle className="text-yellow-500" />;
      case 'danger': return <FiAlertCircle className="text-red-500" />;
      case 'info': return <FiInfo className="text-blue-500" />;
      case 'success': return <FiCheckCircle className="text-green-500" />;
      default: return <FiBell className="text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700">
                <FiGlobe className="text-white text-xl" />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">Migração Inteligente</h1>
                <p className="text-sm text-gray-500">Sistema de Gestão de Vistos</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button 
                  onClick={handleMarkAllAlertsAsRead}
                  className="relative p-2 rounded-full hover:bg-gray-100"
                >
                  <FiBell className="text-xl text-gray-600" />
                  {unreadAlerts.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadAlerts.length}
                    </span>
                  )}
                </button>
              </div>
              <button 
                onClick={handleAddNewPassenger}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors"
              >
                <FiPlus className="mr-2" />
                Novo Passageiro
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Passageiros</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiUser className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Vistos Válidos</p>
                <p className="text-3xl font-bold text-green-600">{stats.valid}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FiCheckCircle className="text-green-600 text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">A Expirar</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.expiring}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FiAlertTriangle className="text-yellow-600 text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Alertas Ativos</p>
                <p className="text-3xl font-bold text-red-600">{stats.unreadAlertsCount}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <FiAlertCircle className="text-red-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Passenger List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="px-6 py-4 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Passageiros</h2>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Buscar passageiro..."
                        className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <select
                      className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="all">Todos</option>
                      <option value="valid">Válidos</option>
                      <option value="expiring">A expirar</option>
                      <option value="expired">Expirados</option>
                      <option value="extended">Estendidos</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="overflow-y-auto max-h-[600px]">
                {filteredPassengers.map(passenger => (
                  <div
                    key={passenger.id}
                    className={`px-6 py-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedPassenger?.id === passenger.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedPassenger(passenger)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
                            <FiUser className="text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <h3 className="font-medium text-gray-900">{passenger.name}</h3>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm text-gray-500 flex items-center">
                              <FiGlobe className="mr-1" /> {passenger.nationality}
                            </span>
                            <span className="text-sm text-gray-500">
                              Passaporte: {passenger.passportNumber}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(passenger.status)}
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(passenger.status)}`}>
                              {passenger.status === 'valid' ? 'Válido' :
                               passenger.status === 'expiring' ? 'A expirar' :
                               passenger.status === 'expired' ? 'Expirado' :
                               'Estendido'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {passenger.daysRemaining > 0 ? (
                              <span className="flex items-center">
                                <FiClock className="mr-1" /> {passenger.daysRemaining} dias restantes
                              </span>
                            ) : (
                              <span className="text-red-600 flex items-center">
                                <FiAlertCircle className="mr-1" /> Expirado há {Math.abs(passenger.daysRemaining)} dias
                              </span>
                            )}
                          </p>
                        </div>
                        
                        {passenger.alerts.filter(a => !a.read).length > 0 && (
                          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                            {passenger.alerts.filter(a => !a.read).length} alerta(s)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Selected Passenger Details */}
          <div className="space-y-8">
            {selectedPassenger ? (
              <>
                {/* Passenger Details Card */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{selectedPassenger.name}</h3>
                      <p className="text-gray-500">{selectedPassenger.nationality} • {selectedPassenger.visaType}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(selectedPassenger.status)}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedPassenger.status)}`}>
                        {selectedPassenger.status === 'valid' ? 'Visto Válido' :
                         selectedPassenger.status === 'expiring' ? 'A Expirar' :
                         selectedPassenger.status === 'expired' ? 'Expirado' :
                         'Estendido'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Nº Passaporte</p>
                        <p className="font-medium">{selectedPassenger.passportNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Tipo de Visto</p>
                        <p className="font-medium">{selectedPassenger.visaType}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Data de Entrada</p>
                        <p className="font-medium">{selectedPassenger.entryDate.toLocaleDateString('pt-BR')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Duração do Visto</p>
                        <p className="font-medium">{selectedPassenger.visaDurationDays} dias</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Contato</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <FiMail className="text-gray-400" />
                          <p className="font-medium">{selectedPassenger.email}</p>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <FiPhone className="text-gray-400" />
                          <p className="font-medium">{selectedPassenger.phone}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Tempo Restante</p>
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className={`h-2.5 rounded-full ${
                                selectedPassenger.daysRemaining > 30 ? 'bg-green-500' :
                                selectedPassenger.daysRemaining > 0 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(100, Math.max(0, (selectedPassenger.daysRemaining / selectedPassenger.visaDurationDays) * 100))}%` }}
                            ></div>
                          </div>
                          <p className={`text-lg font-bold mt-1 ${
                            selectedPassenger.daysRemaining > 30 ? 'text-green-600' :
                            selectedPassenger.daysRemaining > 0 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {selectedPassenger.daysRemaining > 0 
                              ? `${selectedPassenger.daysRemaining} dias restantes`
                              : `Expirado há ${Math.abs(selectedPassenger.daysRemaining)} dias`
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Extend Visa Form */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Estender Visto</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dias Adicionais
                      </label>
                      <div className="flex items-center">
                        <input
                          type="number"
                          min="1"
                          max="365"
                          value={extensionDays}
                          onChange={(e) => setExtensionDays(e.target.value)}
                          className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="30"
                        />
                        <span className="ml-2 text-gray-500">dias</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Motivo da Extensão
                      </label>
                      <textarea
                        value={extensionReason}
                        onChange={(e) => setExtensionReason(e.target.value)}
                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                        placeholder="Descreva o motivo da extensão do visto..."
                      />
                    </div>
                    
                    <button
                      onClick={handleExtendVisa}
                      disabled={!extensionDays || !extensionReason}
                      className={`w-full py-3 rounded-lg font-medium flex items-center justify-center ${
                        !extensionDays || !extensionReason
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
                      }`}
                    >
                      <FiEdit className="mr-2" />
                      Estender Visto
                    </button>
                    
                    <button
                      onClick={() => handleSendAlert(selectedPassenger, 'Lembrete: seu visto está prestes a expirar. Por favor, regularize sua situação.')}
                      className="w-full py-3 border border-blue-600 text-blue-600 rounded-lg font-medium flex items-center justify-center hover:bg-blue-50"
                    >
                      <FiSend className="mr-2" />
                      Enviar Alerta ao Passageiro
                    </button>
                  </div>
                </div>

                {/* Alerts */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Alertas</h3>
                    {selectedPassenger.alerts.length > 0 && (
                      <span className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">
                        {selectedPassenger.alerts.filter(a => !a.read).length} não lidos
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {selectedPassenger.alerts.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">Nenhum alerta para este passageiro.</p>
                    ) : (
                      selectedPassenger.alerts.map(alert => (
                        <div
                          key={alert.id}
                          className={`p-4 rounded-lg border-l-4 ${getAlertColor(alert.type)} ${alert.read ? 'opacity-75' : ''}`}
                        >
                          <div className="flex justify-between">
                            <div className="flex items-start">
                              {getAlertIcon(alert.type)}
                              <div className="ml-3">
                                <p className="text-sm font-medium">{alert.message}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {alert.date.toLocaleDateString('pt-BR')} {alert.date.toLocaleTimeString('pt-BR')}
                                </p>
                              </div>
                            </div>
                            {!alert.read && (
                              <button
                                onClick={() => handleMarkAlertAsRead(alert.id)}
                                className="text-xs text-blue-600 hover:text-blue-800"
                              >
                                Marcar como lido
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                <FiUser className="mx-auto text-4xl text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum passageiro selecionado</h3>
                <p className="text-gray-500">Selecione um passageiro da lista para ver detalhes e gerenciar o visto.</p>
              </div>
            )}
          </div>
        </div>

        {/* System Status Footer */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm text-gray-700">Sistema ativo • Monitorando {passengers.length} passageiros</span>
              </div>
              <span className="text-sm text-gray-500">
                Atualização automática a cada 5 segundos
              </span>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="flex items-center px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
            >
              <FiRefreshCw className="mr-2" />
              Atualizar Sistema
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;