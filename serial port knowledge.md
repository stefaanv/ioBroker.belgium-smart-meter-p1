# Knowledge about serial ports

## Forward Linux serial port to Windows

https://www.serial-over-ethernet.com/com-port-redirector/com-port-redirector-linux-windows/
ser2net installeren en configureren

```bash
sudo apt-get ser2net    # installeren
sudo nano ser2net.yaml  # config bestand editeren
ser2net                 # service starten
```

Config `bestand /etc/ser2net.yaml`

```yaml
connection: &smartmeter
    accepter: tcp,2000
    enable: on
    options:
      banner: *banner
      kickolduser: true
      telnet-brk-on-sync: true
    connector: serialdev,
              /dev/ttyUSB0,
              115200n81,local
```

Service herstarten met `sudo systemctl restart ser2net`

## Windows client kant

Netburner Virtual COMM port

-   Protocol RAW Client
-   `verbinden met 192.168.0.11:2000`
-   verkeer bekijken met RealTerm

## TCP server opzetten

Open poorten oplijsten

```bash
sudo lsof -i -P -n | grep LISTEN
```

netcat -l -p 2000
