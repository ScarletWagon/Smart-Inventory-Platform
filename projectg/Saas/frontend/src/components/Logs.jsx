import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Pagination,
  CircularProgress,
  Alert
} from '@mui/material';
import { fetchLogs, fetchLogsByAction, fetchLogsByEntityType } from '../api/backend';

const actionColors = {
  CREATE: 'success',
  UPDATE: 'info',
  DELETE: 'error',
  SALE: 'primary',
  STOCK_ADJUSTMENT: 'warning'
};

const entityColors = {
  PRODUCT: 'secondary',
  SALE_RECORD: 'primary'
};

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);

  const loadLogs = async (pageNum = 0, filterType = 'all') => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (filterType === 'all') {
        response = await fetchLogs(pageNum, 20);
        setLogs(response.content || []);
        setTotalPages(response.totalPages || 1);
      } else if (filterType.startsWith('action:')) {
        const action = filterType.replace('action:', '');
        response = await fetchLogsByAction(action);
        setLogs(response || []);
        setTotalPages(1);
      } else if (filterType.startsWith('entity:')) {
        const entityType = filterType.replace('entity:', '');
        response = await fetchLogsByEntityType(entityType);
        setLogs(response || []);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error loading logs:', error);
      setError('Failed to load logs: ' + error.message);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs(page - 1, filter);
  }, [page, filter]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        System Logs
      </Typography>

      {/* Filter Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Filter Logs</InputLabel>
            <Select
              value={filter}
              label="Filter Logs"
              onChange={handleFilterChange}
            >
              <MenuItem value="all">All Logs</MenuItem>
              <MenuItem value="action:CREATE">Create Actions</MenuItem>
              <MenuItem value="action:UPDATE">Update Actions</MenuItem>
              <MenuItem value="action:DELETE">Delete Actions</MenuItem>
              <MenuItem value="action:SALE">Sales</MenuItem>
              <MenuItem value="action:STOCK_ADJUSTMENT">Stock Adjustments</MenuItem>
              <MenuItem value="entity:PRODUCT">Product Changes</MenuItem>
              <MenuItem value="entity:SALE_RECORD">Sales Records</MenuItem>
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Logs Table */}
      <Card>
        <CardContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer component={Paper} sx={{ mb: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>Action</TableCell>
                      <TableCell>Entity Type</TableCell>
                      <TableCell>Entity ID</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>User</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {logs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <Typography variant="body1" color="textSecondary">
                            No logs found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      logs.map((log) => (
                        <TableRow key={log.id} hover>
                          <TableCell>
                            <Typography variant="body2">
                              {formatTimestamp(log.timestamp)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={log.action}
                              color={actionColors[log.action] || 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={log.entityType}
                              color={entityColors[log.entityType] || 'default'}
                              variant="outlined"
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {log.entityId}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {log.description}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {log.userName}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Box>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
