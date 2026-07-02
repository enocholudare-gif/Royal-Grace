<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ ucfirst($type) }} Report</title>
    <style>
        body { font-family: sans-serif; font-size: 14px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <h2>{{ ucfirst($type) }} Report</h2>
    <p>Generated on: {{ now()->format('Y-m-d H:i') }}</p>

    @if($type === 'dashboard')
        <table>
            <tr><th>Metric</th><th>Value</th></tr>
            <tr><td>Total Clients</td><td>{{ $data['total_clients'] }}</td></tr>
            <tr><td>Active Caregivers</td><td>{{ $data['active_caregivers'] }}</td></tr>
            <tr><td>Revenue</td><td>{{ number_format($data['revenue'], 2) }}</td></tr>
            <tr><td>Active Bookings</td><td>{{ $data['active_bookings'] }}</td></tr>
            <tr><td>Upcoming Visits</td><td>{{ $data['upcoming_visits'] }}</td></tr>
            <tr><td>Cancellation Rate (%)</td><td>{{ $data['cancellation_rate'] }}</td></tr>
        </table>
    @else
        @if(count($data) > 0)
            <table>
                <thead>
                    <tr>
                        @foreach(array_keys((array) $data[0]) as $header)
                            <th>{{ ucwords(str_replace('_', ' ', $header)) }}</th>
                        @endforeach
                    </tr>
                </thead>
                <tbody>
                    @foreach($data as $row)
                        <tr>
                            @foreach((array) $row as $value)
                                <td>{{ $value }}</td>
                            @endforeach
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <p>No data available for this report.</p>
        @endif
    @endif
</body>
</html>
