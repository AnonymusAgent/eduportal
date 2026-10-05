'use client';

import { useState, useEffect } from 'react';
import Card, { CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import Alert from '@/components/ui/Alert';
import EmptyState from '@/components/ui/EmptyState';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { formatDate } from '@/lib/utils';
import {
  HelpCircle,
  Plus,
  MessageCircle,
  Clock,
  CheckCircle,
  Send,
} from 'lucide-react';

interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  category: string;
  status: string;
  createdAt: string;
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Form state
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/support/tickets');
      if (response.ok) {
        const data = await response.json();
        setTickets(data.tickets || []);
      }
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, subject, description }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to submit ticket');
        return;
      }

      const data = await response.json();
      setSuccess(`Ticket submitted successfully! Reference: ${data.ticketNumber}`);
      setShowNewTicket(false);
      setCategory('');
      setSubject('');
      setDescription('');
      fetchTickets();
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support Center</h1>
          <p className="text-gray-600">Get help with your queries</p>
        </div>
        <Button
          onClick={() => setShowNewTicket(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          New Ticket
        </Button>
      </div>

      {success && (
        <Alert variant="success" onDismiss={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert variant="error" onDismiss={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* New Ticket Form */}
      {showNewTicket && (
        <Card>
          <CardTitle className="mb-4">Submit a New Ticket</CardTitle>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { value: 'technical', label: 'Technical Issue' },
                { value: 'admission', label: 'Admission Query' },
                { value: 'fee', label: 'Fee Related' },
                { value: 'academic', label: 'Academic Query' },
                { value: 'change_request', label: 'Change Request' },
                { value: 'general', label: 'General Inquiry' },
              ]}
              placeholder="Select category"
              required
            />

            <Input
              label="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief description of your issue"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please provide detailed information about your query..."
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNewTicket(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isLoading}
                rightIcon={<Send className="w-4 h-4" />}
              >
                Submit Ticket
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Tickets List */}
      <Card>
        <Tabs defaultValue="all">
          <TabsList ariaLabel="Filter tickets">
            <TabsTrigger value="all">All Tickets</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <TicketList tickets={tickets} />
          </TabsContent>

          <TabsContent value="open">
            <TicketList
              tickets={tickets.filter(
                (t) => t.status === 'open' || t.status === 'in_progress'
              )}
            />
          </TabsContent>

          <TabsContent value="resolved">
            <TicketList
              tickets={tickets.filter(
                (t) => t.status === 'resolved' || t.status === 'closed'
              )}
            />
          </TabsContent>
        </Tabs>
      </Card>

      {/* Quick Help */}
      <Card>
        <CardTitle className="mb-4">Quick Help</CardTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">IT Support</h4>
            <p className="text-sm text-gray-600 mb-2">
              For technical issues with the portal
            </p>
            <a href="mailto:it@eduportal.edu" className="text-sm text-blue-600 hover:text-blue-700">
              it@eduportal.edu
            </a>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Admissions Office</h4>
            <p className="text-sm text-gray-600 mb-2">
              For admission related queries
            </p>
            <a href="mailto:admissions@eduportal.edu" className="text-sm text-blue-600 hover:text-blue-700">
              admissions@eduportal.edu
            </a>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Finance Office</h4>
            <p className="text-sm text-gray-600 mb-2">
              For fee and payment queries
            </p>
            <a href="mailto:finance@eduportal.edu" className="text-sm text-blue-600 hover:text-blue-700">
              finance@eduportal.edu
            </a>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Academic Office</h4>
            <p className="text-sm text-gray-600 mb-2">
              For academic and course queries
            </p>
            <a href="mailto:academics@eduportal.edu" className="text-sm text-blue-600 hover:text-blue-700">
              academics@eduportal.edu
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}

function TicketList({ tickets }: { tickets: Ticket[] }) {
  if (tickets.length === 0) {
    return (
      <EmptyState
        icon={<HelpCircle className="w-8 h-8 text-gray-400" />}
        title="No Tickets"
        description="You haven't submitted any support tickets yet."
      />
    );
  }

  return (
    <div className="space-y-3">
      {tickets.map((ticket) => (
        <div
          key={ticket.id}
          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div
              className={`p-2 rounded-full ${
                ticket.status === 'open'
                  ? 'bg-blue-100'
                  : ticket.status === 'in_progress'
                  ? 'bg-yellow-100'
                  : 'bg-green-100'
              }`}
            >
              {ticket.status === 'open' ? (
                <MessageCircle className="w-5 h-5 text-blue-600" aria-hidden="true" />
              ) : ticket.status === 'in_progress' ? (
                <Clock className="w-5 h-5 text-yellow-600" aria-hidden="true" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-600" aria-hidden="true" />
              )}
            </div>
            <div>
              <p className="font-medium text-gray-900">{ticket.subject}</p>
              <p className="text-sm text-gray-500">
                {ticket.ticketNumber} • {ticket.category}
              </p>
            </div>
          </div>
          <div className="text-right">
            <Badge status={ticket.status}>{ticket.status.replace('_', ' ')}</Badge>
            <p className="text-xs text-gray-500 mt-1">{formatDate(ticket.createdAt)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
