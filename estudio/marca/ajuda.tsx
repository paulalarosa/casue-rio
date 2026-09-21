import type { ReactNode } from "react";
import { Box, Card, Container, Flex, Heading, Stack, Text } from "@sanity/ui";
import { Placa } from "./placa";

export const TERRACOTA = "#a8482a";
export const TINTA = "#171310";
export const BRONZE = "#8a5a33";
export const PAPEL = "#f6f2e9";
export const AREIA = "#c0ac87";

export function PaginaAjuda({
  titulo,
  linha,
  children,
}: {
  titulo: string;
  linha: string;
  children: ReactNode;
}) {
  return (
    <Box padding={4} paddingY={5} style={{ overflowY: "auto", height: "100%" }}>
      <Container width={1}>
        <Stack gap={5}>
          <Flex align="center" gap={3}>
            <Placa tamanho={40} />
            <Stack gap={2}>
              <Heading
                size={3}
                style={{
                  fontFamily: '"Unbounded", "Century Gothic", sans-serif',
                  color: TINTA,
                }}
              >
                {titulo}
              </Heading>
              <Text size={1} style={{ color: BRONZE }}>
                {linha}
              </Text>
            </Stack>
          </Flex>
          {children}
        </Stack>
      </Container>
    </Box>
  );
}

export function Selo({ children }: { children: ReactNode }) {
  return (
    <Box
      style={{
        flex: "none",
        width: 30,
        height: 30,
        borderRadius: 999,
        background: TERRACOTA,
        color: PAPEL,
        display: "grid",
        placeItems: "center",
        fontWeight: 700,
        fontSize: 14,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {children}
    </Box>
  );
}

export function Cartao({
  selo,
  titulo,
  children,
}: {
  selo: ReactNode;
  titulo: string;
  children: ReactNode;
}) {
  return (
    <Card padding={4} radius={3} shadow={1}>
      <Flex gap={4} align="flex-start">
        <Selo>{selo}</Selo>
        <Stack gap={3} flex={1}>
          <Text weight="semibold" size={2} style={{ color: TINTA }}>
            {titulo}
          </Text>
          {children}
        </Stack>
      </Flex>
    </Card>
  );
}

export function Linha({ children }: { children: ReactNode }) {
  return (
    <Text size={1} muted style={{ lineHeight: 1.6 }}>
      {children}
    </Text>
  );
}

export function Forte({ children }: { children: ReactNode }) {
  return <b style={{ color: TINTA }}>{children}</b>;
}

export function Botao({ children }: { children: ReactNode }) {
  return (
    <b
      style={{
        color: TINTA,
        fontFamily: "inherit",
        background: "rgba(168, 72, 42, 0.1)",
        borderRadius: 4,
        padding: "1px 5px",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </b>
  );
}
