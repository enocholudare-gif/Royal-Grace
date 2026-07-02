<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ReportsExport implements FromArray, WithHeadings, ShouldAutoSize, WithStyles
{
    public function __construct(
        protected array $data
    ) {}

    public function array(): array
    {
        // Extract metrics nicely, handles simple flat arrays or array of arrays
        if (empty($this->data)) {
            return [];
        }

        // Dashboard returns associative array natively, transform it
        if (isset($this->data['total_clients'])) {
            return [
                [
                    'Total Clients' => $this->data['total_clients'],
                    'Active Caregivers' => $this->data['active_caregivers'],
                    'Revenue' => $this->data['revenue'],
                    'Active Bookings' => $this->data['active_bookings'],
                    'Upcoming Visits' => $this->data['upcoming_visits'],
                    'Cancellation Rate (%)' => $this->data['cancellation_rate'],
                ]
            ];
        }

        return $this->data;
    }

    public function headings(): array
    {
        if (empty($this->data)) {
            return [];
        }

        if (isset($this->data['total_clients'])) {
            return [
                'Total Clients', 
                'Active Caregivers', 
                'Revenue', 
                'Active Bookings', 
                'Upcoming Visits', 
                'Cancellation Rate (%)'
            ];
        }

        return array_keys((array) $this->data[0]);
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
