import React from "react";
import {Html, Head, Body, Container, Heading, Text} from '@react-email/components'

interface AccountDeletionWarningEmailProps{
    name: string;
    deletionDate: string;
}

const AccountDeletionWarningEmail:React.FC<AccountDeletionWarningEmailProps> = ({name, deletionDate}) => {
  return (
    <Html>
      <Head />
      <Body
        style={{
          fontFamily: "Arial, sans-serif",
          padding: "20px",
          backgroundColor: "#f4f4f4",
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            margin: "auto",
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <Heading
            style={{
              color: "#d9534f",
              textAlign: "center",
              marginBottom: "20px",
              fontSize: "24px",
            }}
          >
            Action Required: Account Deletion Warning
          </Heading>
          <Text
            style={{
              fontSize: "16px",
              lineHeight: "1.5",
              color: "#333",
              marginBottom: "20px",
            }}
          >
            Hello <strong>{name}</strong>,
          </Text>
          <Text
            style={{
              fontSize: "16px",
              lineHeight: "1.5",
              color: "#333",
              marginBottom: "20px",
            }}
          >
            We noticed that your account is still not verified. Your account is scheduled for deletion on{" "}
            <strong>{deletionDate}</strong>. If you wish to keep your account, please verify your email before this date.
          </Text>
          <Text
            style={{
              fontSize: "14px",
              lineHeight: "1.5",
              color: "#777",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            If you have already verified your email, please ignore this message.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default AccountDeletionWarningEmail;