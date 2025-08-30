import { Card, CardContent, Typography, LinearProgress, Chip, Stack, ButtonGroup, Button, Tooltip } from '@mui/material';
import { pct, canSkipToday, attendanceStatus, remainingSkips } from '../utils/attendance';

type Props = {
  name: string;
  attended: number;
  total: number;
  onPresent: () => void;
  onAbsent: () => void;
  onDelete: () => void;
};

export default function AttendanceCard({ name, attended, total, onPresent, onAbsent, onDelete }: Props) {
  const percentage = pct(attended, total);
  const canSkip = canSkipToday(attended, total);
  const status = attendanceStatus(attended, total);
  const skipsLeft = remainingSkips(attended, total);

  const statusColor: 'success' | 'warning' | 'error' =
    status === 'safe' ? 'success' : status === 'warning' ? 'warning' : 'error';
  const statusLabel =
    status === 'safe' ? 'On Track' : status === 'warning' ? 'Borderline' : 'At Risk';

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack spacing={1.25} sx={{ mb: 2 }}>
          <Typography variant="h6">{name}</Typography>

          <Typography variant="body2">Attendance: {percentage}%</Typography>
          <Typography variant="body2" color="text.secondary">
            {attended} / {total} classes attended
          </Typography>

          <LinearProgress variant="determinate" value={percentage} sx={{ height: 10, borderRadius: 5 }} />

          <Stack direction="row" spacing={1} alignItems="center">
            <Chip label={statusLabel} color={statusColor} variant="outlined" />
            <Chip
              label={canSkip ? '✅ Can skip today' : '❗ Should attend today'}
              size="small"
              color={canSkip ? 'success' : 'error'}
            />
            {total > 0 && (
              <Chip
                label={`Skips left: ${skipsLeft}`}
                size="small"
                variant="outlined"
              />
            )}
          </Stack>
        </Stack>

        <ButtonGroup fullWidth variant="contained" size="small">
          <Tooltip title="Mark present (attended and total both +1)">
            <Button onClick={onPresent}>Mark Present</Button>
          </Tooltip>
          <Tooltip title="Mark absent (only total +1)">
            <Button color="warning" onClick={onAbsent}>Mark Absent</Button>
          </Tooltip>
          <Button color="error" size="small" variant="outlined" onClick={onDelete}> Delete
</Button>
        </ButtonGroup>
      </CardContent>
    </Card>
  );
}

