import serial
import serial.tools.list_ports
import time

class KLineSerial:
    def __init__(self, port=None, baudrate=10400, timeout=1):
        """
        Inisialisasi K-Line Serial untuk KWP2000.
        Menggunakan default baudrate 10400, 8 data bits, no parity, dan 1 stop bit.
        """
        self.port = port
        self.baudrate = baudrate
        self.timeout = timeout
        self.serial_connection = None

    def find_active_ports(self):
        """Mencari semua port COM yang aktif."""
        ports = serial.tools.list_ports.comports()
        active_ports = [port.device for port in ports]
        return active_ports

    def connect(self):
        """Membuka koneksi serial dengan konfigurasi standar KWP2000."""
        # Jika port tidak ditentukan, cari dan gunakan port pertama yang tersedia
        if not self.port:
            available_ports = self.find_active_ports()
            if not available_ports:
                print("[LOG] Tidak ada port COM yang aktif ditemukan.")
                return False
            
            print(f"[LOG] Port aktif ditemukan: {available_ports}")
            self.port = available_ports[0]
            print(f"[LOG] Mencoba terhubung secara otomatis ke {self.port}...")

        try:
            # Membuka koneksi dengan format KWP2000
            self.serial_connection = serial.Serial(
                port=self.port,
                baudrate=self.baudrate,
                bytesize=serial.EIGHTBITS,   # 8 data bits
                parity=serial.PARITY_NONE,   # Parity none
                stopbits=serial.STOPBITS_ONE, # 1 stop bit
                timeout=self.timeout
            )
            
            if self.serial_connection.is_open:
                print(f"[LOG] Koneksi berhasil dibuka di {self.port} dengan baudrate {self.baudrate}.")
                return True
                
        except serial.SerialException as e:
            print(f"[LOG] Error saat membuka port {self.port}: {e}")
            return False

    def fast_init(self):
        """
        Melakukan proses Fast Initialization.
        Menarik jalur ke LOW (0V) selama 70ms, lalu HIGH selama 130ms,
        kemudian mengirim byte Start Communication (0x81).
        """
        if self.serial_connection and self.serial_connection.is_open:
            print("[LOG] Memulai Fast Initialization (70ms LOW, 130ms HIGH)...")
            try:
                # Memaksa TX line menjadi LOW
                self.serial_connection.break_condition = True
                time.sleep(0.070) # 70 milidetik
                
                # Mengembalikan TX line menjadi HIGH
                self.serial_connection.break_condition = False
                time.sleep(0.130) # 130 milidetik
                
                print("[LOG] Proses wake up selesai. Mengirim 0x81...")
                return self.send_data(bytes([0x81]))
            except Exception as e:
                print(f"[LOG] Gagal saat Fast Initialization: {e}")
                return 0
        else:
            print("[LOG] Gagal: Koneksi serial belum terbuka.")
            return 0

    def send_data(self, data: bytes):
        """Mengirim data byte melalui port serial."""
        if self.serial_connection and self.serial_connection.is_open:
            try:
                bytes_written = self.serial_connection.write(data)
                self.serial_connection.flush() # Pastikan data langsung terkirim
                print(f"[LOG] Data berhasil dikirim ({bytes_written} bytes): {data.hex().upper()}")
                return bytes_written
            except Exception as e:
                print(f"[LOG] Gagal mengirim data: {e}")
                return 0
        else:
            print("[LOG] Gagal: Koneksi serial belum terbuka.")
            return 0

    def receive_data(self, num_bytes=1024):
        """Menerima data dari port serial."""
        if self.serial_connection and self.serial_connection.is_open:
            try:
                data = self.serial_connection.read(num_bytes)
                if data:
                    print(f"[LOG] Data berhasil diterima ({len(data)} bytes): {data.hex().upper()}")
                else:
                    # Tidak mencetak log jika tidak ada data untuk mencegah log spam
                    pass
                return data
            except Exception as e:
                print(f"[LOG] Gagal menerima data: {e}")
                return b''
        else:
            print("[LOG] Gagal: Koneksi serial belum terbuka.")
            return b''

    def close(self):
        """Menutup koneksi serial."""
        if self.serial_connection and self.serial_connection.is_open:
            self.serial_connection.close()
            print(f"[LOG] Koneksi serial pada port {self.port} ditutup.")


if __name__ == "__main__":
    # -- CONTOH PENGGUNAAN --
    kline = KLineSerial()
    
    if kline.connect():
        # Memulai ECU menggunakan Fast Initialization
        kline.fast_init()
        
        # Tunggu sejenak agar ECU memberikan Key Bytes (respon inisialisasi)
        time.sleep(0.1)
        
        # Baca respon yang datang
        response = kline.receive_data()
        
        # Tutup koneksi
        kline.close()
