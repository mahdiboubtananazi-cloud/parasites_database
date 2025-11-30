import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  TextField,
  InputAdornment,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Pagination,
  Paper,
  Stack,
  FormControlLabel,
  Checkbox,
  Divider,
  IconButton,
  useTheme,
  alpha,
  Collapse,
} from "@mui/material";
import { Search, ChevronDown, ChevronUp, X } from "lucide-react";
import { useParasites } from "../hooks/useParasites";
import { useTranslation } from "react-i18next";

const fixImageUrl = (url?: string) => {
  if (!url) return "https://placehold.co/400x300?text=No+Image";
  if (url.includes("localhost")) {
    return url.replace(
      "localhost",
      window.location.hostname === "localhost" ? "localhost" : window.location.hostname
    );
  }
  return url;
};

interface Filters {
  types: string[];
  hosts: string[];
  dateRange: "all" | "week" | "month" | "year";
}

const Archive = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { parasites, loading } = useParasites();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Filters>({
    types: [],
    hosts: [],
    dateRange: "all",
  });
  const [expandedSections, setExpandedSections] = useState({
    types: true,
    hosts: true,
    date: false,
  });

  const itemsPerPage = 12;
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isRtl = i18n.language === "ar";

  useEffect(() => {
    const query = searchParams.get("search");
    if (query) setSearchTerm(query);
  }, [searchParams]);

  // احسب الفلاتر المتاحة
  const availableTypes = useMemo(() => {
    if (!parasites) return [];
    return Array.from(new Set(parasites.map((p) => p.type).filter(Boolean))).sort();
  }, [parasites]);

  const availableHosts = useMemo(() => {
    if (!parasites) return [];
    return Array.from(new Set(parasites.map((p) => p.hostSpecies).filter(Boolean))).sort();
  }, [parasites]);

  // نتائج البحث والفلتر
  const filteredResults = useMemo(() => {
    if (!parasites) return [];

    return parasites.filter((p) => {
      if ((p as any).status === "pending") return false;

      // البحث
      const term = searchTerm.toLowerCase();
      const searchMatch =
        (p.scientificName || "").toLowerCase().includes(term) ||
        (p.arabicName || "").toLowerCase().includes(term) ||
        (p.hostSpecies || "").toLowerCase().includes(term) ||
        (p.type || "").toLowerCase().includes(term);

      if (!searchMatch) return false;

      // الفلاتر
      if (filters.types.length > 0 && !filters.types.includes(p.type || "")) {
        return false;
      }

      if (filters.hosts.length > 0 && !filters.hosts.includes(p.hostSpecies || "")) {
        return false;
      }

      return true;
    });
  }, [parasites, searchTerm, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedResults = filteredResults.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  const handleTypeToggle = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type],
    }));
  };

  const handleHostToggle = (host: string) => {
    setFilters((prev) => ({
      ...prev,
      hosts: prev.hosts.includes(host)
        ? prev.hosts.filter((h) => h !== host)
        : [...prev.hosts, host],
    }));
  };

  const handleDateToggle = (date: "all" | "week" | "month" | "year") => {
    setFilters((prev) => ({
      ...prev,
      dateRange: prev.dateRange === date ? "all" : date,
    }));
  };

  const toggleSection = (section: "types" | "hosts" | "date") => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const clearFilters = () => {
    setFilters({ types: [], hosts: [], dateRange: "all" });
    setSearchTerm("");
  };

  const hasActiveFilters = filters.types.length > 0 || filters.hosts.length > 0 || searchTerm;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8f7f5", py: 4 }}>
      <Container maxWidth="lg">
        {/* Search & Filter Section */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
          <Stack spacing={3}>
            {/* Title */}
            <Typography variant="h5" fontWeight={700} color="text.primary">
              Academic Archive
            </Typography>

            {/* Search Bar */}
            <TextField
              fullWidth
              placeholder="Search by name, host species, or type..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.primary.main, 0.02),
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "all 0.2s",
                  "&:focus-within": {
                    backgroundColor: "white",
                    borderColor: theme.palette.primary.main,
                    boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} color="#9CA3AF" />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <IconButton onClick={() => setSearchTerm("")} size="small">
                    <X size={14} />
                  </IconButton>
                ),
              }}
            />

            <Divider />

            {/* Collapsible Filters */}
            <Stack spacing={1}>
              {/* Types Filter */}
              <Box>
                <Button
                  fullWidth
                  onClick={() => toggleSection("types")}
                  sx={{
                    justifyContent: "space-between",
                    textTransform: "none",
                    color: "text.primary",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    p: 1.5,
                    bgcolor: expandedSections.types ? alpha(theme.palette.primary.main, 0.05) : "transparent",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography fontWeight={600}>Parasite Type</Typography>
                    {filters.types.length > 0 && (
                      <Box
                        sx={{
                          px: 1,
                          py: 0.25,
                          bgcolor: theme.palette.primary.main,
                          color: "white",
                          borderRadius: 1,
                          fontSize: "0.75rem",
                          fontWeight: 700,
                        }}
                      >
                        {filters.types.length}
                      </Box>
                    )}
                  </Box>
                  {expandedSections.types ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </Button>

                <Collapse in={expandedSections.types}>
                  <Stack spacing={1.5} sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.02), borderRadius: "0 0 8px 8px", borderLeft: "1px solid", borderRight: "1px solid", borderBottom: "1px solid", borderColor: "divider" }}>
                    {availableTypes.map((type) => (
                      <FormControlLabel
                        key={type}
                        control={
                          <Checkbox
                            checked={filters.types.includes(type)}
                            onChange={() => handleTypeToggle(type)}
                            size="small"
                          />
                        }
                        label={<Typography variant="body2">{type}</Typography>}
                      />
                    ))}
                  </Stack>
                </Collapse>
              </Box>

              {/* Hosts Filter */}
              <Box>
                <Button
                  fullWidth
                  onClick={() => toggleSection("hosts")}
                  sx={{
                    justifyContent: "space-between",
                    textTransform: "none",
                    color: "text.primary",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    p: 1.5,
                    bgcolor: expandedSections.hosts ? alpha(theme.palette.primary.main, 0.05) : "transparent",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography fontWeight={600}>Host Species</Typography>
                    {filters.hosts.length > 0 && (
                      <Box
                        sx={{
                          px: 1,
                          py: 0.25,
                          bgcolor: theme.palette.primary.main,
                          color: "white",
                          borderRadius: 1,
                          fontSize: "0.75rem",
                          fontWeight: 700,
                        }}
                      >
                        {filters.hosts.length}
                      </Box>
                    )}
                  </Box>
                  {expandedSections.hosts ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </Button>

                <Collapse in={expandedSections.hosts}>
                  <Stack spacing={1.5} sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.02), borderRadius: "0 0 8px 8px", borderLeft: "1px solid", borderRight: "1px solid", borderBottom: "1px solid", borderColor: "divider" }}>
                    {availableHosts.map((host) => (
                      <FormControlLabel
                        key={host}
                        control={
                          <Checkbox
                            checked={filters.hosts.includes(host)}
                            onChange={() => handleHostToggle(host)}
                            size="small"
                          />
                        }
                        label={<Typography variant="body2">{host}</Typography>}
                      />
                    ))}
                  </Stack>
                </Collapse>
              </Box>

              {/* Date Filter */}
              <Box>
                <Button
                  fullWidth
                  onClick={() => toggleSection("date")}
                  sx={{
                    justifyContent: "space-between",
                    textTransform: "none",
                    color: "text.primary",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    p: 1.5,
                    bgcolor: expandedSections.date ? alpha(theme.palette.primary.main, 0.05) : "transparent",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography fontWeight={600}>Date Added</Typography>
                    {filters.dateRange !== "all" && (
                      <Box
                        sx={{
                          px: 1,
                          py: 0.25,
                          bgcolor: theme.palette.primary.main,
                          color: "white",
                          borderRadius: 1,
                          fontSize: "0.75rem",
                          fontWeight: 700,
                        }}
                      >
                        1
                      </Box>
                    )}
                  </Box>
                  {expandedSections.date ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </Button>

                <Collapse in={expandedSections.date}>
                  <Stack spacing={1.5} sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.02), borderRadius: "0 0 8px 8px", borderLeft: "1px solid", borderRight: "1px solid", borderBottom: "1px solid", borderColor: "divider" }}>
                    {[
                      { label: "This Week", value: "week" },
                      { label: "This Month", value: "month" },
                      { label: "This Year", value: "year" },
                      { label: "All Time", value: "all" },
                    ].map((item) => (
                      <FormControlLabel
                        key={item.value}
                        control={
                          <Checkbox
                            checked={filters.dateRange === item.value}
                            onChange={() => handleDateToggle(item.value as any)}
                            size="small"
                          />
                        }
                        label={<Typography variant="body2">{item.label}</Typography>}
                      />
                    ))}
                  </Stack>
                </Collapse>
              </Box>
            </Stack>

            {/* Clear Button */}
            {hasActiveFilters && (
              <>
                <Divider />
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={clearFilters}
                  sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
                >
                  Clear All Filters
                </Button>
              </>
            )}

            {/* Results Count */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: alpha(theme.palette.primary.main, 0.03), p: 2, borderRadius: 2 }}>
              <Typography variant="body2" fontWeight={500}>
                <strong>{filteredResults.length}</strong> results found
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Results */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress />
          </Box>
        ) : filteredResults.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: "center", bgcolor: alpha(theme.palette.primary.main, 0.03), borderRadius: 2 }}>
            <Search size={48} style={{ color: theme.palette.primary.main, marginBottom: 16 }} />
            <Typography variant="h6" fontWeight={600}>
              No Results Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search or filters
            </Typography>
          </Paper>
        ) : (
          <>
            {/* Cards Grid */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
                gap: 3,
                mb: 4,
              }}
            >
              {paginatedResults.map((p) => (
                <Card
                  key={p.id}
                  onClick={() => navigate(`/parasites/${p.id}`)}
                  sx={{
                    cursor: "pointer",
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    transition: "all 0.2s",
                    overflow: "hidden",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      borderColor: theme.palette.primary.main,
                      boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.15)}`,
                    },
                  }}
                >
                  {/* Image */}
                  <CardMedia
                    component="img"
                    height="200"
                    image={fixImageUrl(p.imageUrl)}
                    alt={p.scientificName}
                    sx={{ objectFit: "cover" }}
                  />

                  {/* Content */}
                  <CardContent>
                    <Typography
                      variant="body2"
                      fontWeight={700}
                      color="primary"
                      sx={{ mb: 1, minHeight: "2.4em", lineHeight: 1.2 }}
                    >
                      {p.scientificName}
                    </Typography>

                    {p.arabicName && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
                        {p.arabicName}
                      </Typography>
                    )}

                    {(p as any).description && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          mb: 2,
                        }}
                      >
                        {(p as any).description}
                      </Typography>
                    )}

                    <Button
                      fullWidth
                      size="small"
                      variant="contained"
                      sx={{ mt: 1, textTransform: "none", borderRadius: 1.5 }}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Box>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(_, page) => setCurrentPage(page)}
                  color="primary"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "divider",
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default Archive;
